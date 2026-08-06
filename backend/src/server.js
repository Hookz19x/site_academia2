import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from './database/pool.js';
import { authRequired } from './middleware/auth.js';
import { publicUser } from './utils/user.js';

const app = express();
const port = Number(process.env.PORT || 3333);

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error('Defina DATABASE_URL e JWT_SECRET no arquivo .env.');
}

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));

const createToken = (id) => jwt.sign({}, process.env.JWT_SECRET, { subject: id, expiresIn: '7d' });
const membershipCode = () => `OMEGA-${Math.floor(1000 + Math.random() * 9000)}`;

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) { next(error); }
});

app.post('/api/auth/register', async (req, res, next) => {
  const { nome, email, senha, idade, peso, altura } = req.body;
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6) {
    return res.status(400).json({ message: 'Informe nome, e-mail e uma senha com pelo menos 6 caracteres.' });
  }
  try {
    const passwordHash = await bcrypt.hash(senha, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, age, weight_kg, height_m, membership_code)
       VALUES ($1, LOWER($2), $3, $4, $5, $6, $7)
       RETURNING *`,
      [nome.trim(), email.trim(), passwordHash, idade || null, peso || null, altura || null, membershipCode()]
    );
    const user = publicUser(result.rows[0]);
    res.status(201).json({ token: createToken(user.id), user });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = LOWER($1)', [email?.trim()]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(senha || '', user.password_hash))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
    res.json({ token: createToken(user.id), user: publicUser(user) });
  } catch (error) { next(error); }
});

app.get('/api/me', authRequired, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json({ user: publicUser(result.rows[0]) });
  } catch (error) { next(error); }
});

app.get('/api/workouts', authRequired, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name, days FROM workouts WHERE user_id = $1 ORDER BY created_at', [req.userId]);
    res.json({ workouts: result.rows.map((row) => ({ id: row.id, nome: row.name, dias: row.days })) });
  } catch (error) { next(error); }
});

app.post('/api/workouts', authRequired, async (req, res, next) => {
  const { nome, dias } = req.body;
  if (!nome?.trim() || !Array.isArray(dias)) return res.status(400).json({ message: 'Dados do treino inválidos.' });
  try {
    const result = await pool.query(
      'INSERT INTO workouts (user_id, name, days) VALUES ($1, $2, $3) RETURNING id, name, days',
      [req.userId, nome.trim(), JSON.stringify(dias)]
    );
    const workout = result.rows[0];
    res.status(201).json({ workout: { id: workout.id, nome: workout.name, dias: workout.days } });
  } catch (error) { next(error); }
});

app.put('/api/workouts/:id', authRequired, async (req, res, next) => {
  const { nome, dias } = req.body;
  if (!nome?.trim() || !Array.isArray(dias)) return res.status(400).json({ message: 'Dados do treino inválidos.' });
  try {
    const result = await pool.query(
      `UPDATE workouts SET name = $1, days = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING id, name, days`,
      [nome.trim(), JSON.stringify(dias), req.params.id, req.userId]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Treino não encontrado.' });
    const workout = result.rows[0];
    res.json({ workout: { id: workout.id, nome: workout.name, dias: workout.days } });
  } catch (error) { next(error); }
});

app.delete('/api/workouts/:id', authRequired, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Treino não encontrado.' });
    res.status(204).send();
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, () => console.log(`API da OMEGA GYM em http://localhost:${port}`));
