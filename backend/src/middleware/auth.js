import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) return res.status(401).json({ message: 'Token de autenticação não informado.' });

  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
}
