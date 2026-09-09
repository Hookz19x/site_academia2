'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, salvarSessao, type Role } from '../../lib/api';

export default function Cadastro() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('aluno');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // Dados de Personal / Admin
  const [cref, setCref] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  // Dados corporais (especialmente para aluno)
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function lidarComCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);

    const emailLimpo = email.trim().toLowerCase();

    // Validações locais amigáveis
    if (role !== 'aluno' && !codigoAcesso.trim()) {
      setErro(role === 'personal' 
        ? 'Por favor, informe o código de autorização de Personal Trainer.' 
        : 'Por favor, informe a chave mestra de Administrador.');
      setEnviando(false);
      return;
    }

    try {
      const resposta = await apiFetch<{ token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nome: nome.trim(),
          email: emailLimpo,
          senha,
          role,
          cref: role === 'personal' ? cref.trim() : null,
          codigoAcesso: role !== 'aluno' ? codigoAcesso.trim() : null,
          idade: idade ? Number(idade) : null,
          peso: peso ? Number(peso) : null,
          altura: altura ? Number(altura) : null,
        }),
      });
      salvarSessao(resposta.token);
      router.push('/perfil');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível criar sua conta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-center items-center px-4 py-8 relative">
      <div className="w-full max-w-md mb-4 text-left">
        <Link href="/" className="text-sm font-bold text-blue-500 hover:text-white transition flex items-center gap-1">
          ⬅ Voltar para o Início
        </Link>
      </div>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            ÔMEGA <span className="text-blue-500">GYM</span>
          </h2>
          <p className="text-sm text-gray-400">Selecione seu perfil e crie sua conta</p>
        </div>

        {/* SELETOR DE PERFIL (ALUNO / PERSONAL / ADMIN) */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-gray-400 mb-2 text-[11px] text-center">
            Tipo de Perfil
          </label>
          <div className="grid grid-cols-3 gap-2 bg-black p-1.5 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => { setRole('aluno'); setErro(''); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'aluno'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🎓</span>
              <span>Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('personal'); setErro(''); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'personal'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🏋️</span>
              <span>Personal</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('admin'); setErro(''); }}
              className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>🛡️</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* AVISOS ESPECÍFICOS DE CADA PERFIL */}
        {role === 'personal' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>🔒</span> Cadastro de Personal Trainer
            </p>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Exclusivo para instrutores da academia. É obrigatório informar o código de autorização fornecido pela administração.
            </p>
          </div>
        )}

        {role === 'admin' && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>🔐</span> Acesso Administrativo
            </p>
            <p className="text-[11px] text-purple-200/80 leading-relaxed">
              Área altamente restrita. Requer a chave mestra de segurança da gestão da Ômega Gym.
            </p>
          </div>
        )}

        <form onSubmit={lidarComCadastro} className="space-y-4">
          <div>
            <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-xs">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (erro) setErro('');
              }}
              placeholder={role === 'personal' ? 'Ex: Carlos Personal' : 'Seu nome'}
              className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-3 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-xs">
              E-mail
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erro) setErro('');
              }}
              placeholder="seu@email.com"
              className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-3 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-xs">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (erro) setErro('');
                }}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-3 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs transition"
                title={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
              >
                {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS PARA PERSONAL TRAINER */}
          {role === 'personal' && (
            <>
              <div>
                <label className="block font-bold uppercase tracking-wide text-amber-400 mb-1 text-xs">
                  Registro CREF (Opcional)
                </label>
                <input
                  type="text"
                  value={cref}
                  onChange={(e) => setCref(e.target.value)}
                  placeholder="Ex: 012345-G/PE"
                  className="w-full bg-black border border-zinc-800 focus:border-amber-500 text-white rounded-lg outline-none transition p-3 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wide text-amber-400 mb-1 text-xs">
                  Código de Autorização de Personal *
                </label>
                <div className="relative">
                  <input
                    type={mostrarCodigo ? 'text' : 'password'}
                    required
                    value={codigoAcesso}
                    onChange={(e) => {
                      setCodigoAcesso(e.target.value);
                      if (erro) setErro('');
                    }}
                    placeholder="Digite o código fornecido pela academia"
                    className="w-full bg-black border border-zinc-800 focus:border-amber-500 text-white rounded-lg outline-none transition p-3 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarCodigo(!mostrarCodigo)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs transition"
                    title={mostrarCodigo ? 'Ocultar código' : 'Ver código'}
                  >
                    {mostrarCodigo ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* CAMPO ESPECÍFICO PARA ADMINISTRADOR */}
          {role === 'admin' && (
            <div>
              <label className="block font-bold uppercase tracking-wide text-purple-400 mb-1 text-xs">
                Chave Mestra de Administração *
              </label>
              <div className="relative">
                <input
                  type={mostrarCodigo ? 'text' : 'password'}
                  required
                  value={codigoAcesso}
                  onChange={(e) => {
                    setCodigoAcesso(e.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder="Chave de segurança master"
                  className="w-full bg-black border border-zinc-800 focus:border-purple-500 text-white rounded-lg outline-none transition p-3 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarCodigo(!mostrarCodigo)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs transition"
                  title={mostrarCodigo ? 'Ocultar chave' : 'Ver chave'}
                >
                  {mostrarCodigo ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* DADOS BIOMÉTRICOS (Exibidos para aluno) */}
          {role === 'aluno' && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-[10px]">
                  Idade
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="24"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-[10px]">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="75"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wide text-gray-400 mb-1 text-[10px]">
                  Altura (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  placeholder="1.75"
                  className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition p-2.5 text-xs"
                />
              </div>
            </div>
          )}

          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 text-center font-medium">
              {erro}
            </div>
          )}

          <button
            disabled={enviando}
            type="submit"
            className={`w-full font-bold py-3 rounded-lg active:scale-95 transition mt-2 cursor-pointer ${
              role === 'personal'
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : role === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-white hover:bg-gray-200 text-black'
            } disabled:opacity-60`}
          >
            {enviando
              ? 'Criando conta...'
              : role === 'personal'
              ? 'Criar Conta de Personal'
              : role === 'admin'
              ? 'Criar Conta de Administrador'
              : 'Criar Minha Conta de Aluno'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Já possui cadastro?{' '}
          <Link href="/login" className="text-blue-500 font-semibold hover:underline">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
