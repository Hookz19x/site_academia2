'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, salvarSessao } from '../../lib/api';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
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

    try {
      const resposta = await apiFetch<{ token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nome: nome.trim(),
          email: emailLimpo,
          senha,
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

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            OMEGA <span className="text-blue-500">GYM</span>
          </h2>
          <p className="text-sm text-gray-400">Crie sua conta e comece hoje</p>
        </div>

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
              placeholder="Seu nome"
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

          <div className="grid grid-cols-3 gap-2">
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

          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2.5 text-xs text-red-400 text-center">
              {erro}
            </div>
          )}

          <button
            disabled={enviando}
            type="submit"
            className="w-full bg-white disabled:opacity-60 text-black font-bold py-3 rounded-lg active:scale-95 transition mt-2 hover:bg-gray-200"
          >
            {enviando ? 'Criando conta...' : 'Criar Minha Conta'}
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
