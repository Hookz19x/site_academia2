'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, salvarSessao } from '../../lib/api';

export default function Login() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [senha, setSenha] = useState(''); const [erro, setErro] = useState(''); const [enviando, setEnviando] = useState(false);
  async function entrar(e: React.FormEvent) { e.preventDefault(); setErro(''); setEnviando(true); try { const resposta = await apiFetch<{ token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }); salvarSessao(resposta.token); router.push('/perfil'); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível entrar.'); } finally { setEnviando(false); } }
  return <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-center items-center px-4 relative">
    <div className="w-full max-w-md mb-4 text-left"><Link href="/" className="text-sm font-bold text-blue-500 hover:text-white transition flex items-center gap-1">⬅ Voltar para o Início</Link></div>
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6"><div className="text-center space-y-2"><h2 className="text-2xl font-black uppercase tracking-tight">FORCE<span className="text-blue-500">ACADEMIA</span></h2><p className="text-sm text-gray-400">Entre na sua conta para treinar</p></div>
      <form onSubmit={entrar} className="space-y-4"><div><label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">E-mail</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg p-3 text-sm outline-none transition" /></div><div><label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Senha</label><input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg p-3 text-sm outline-none transition" /></div>{erro && <p className="text-xs text-red-400 text-center">{erro}</p>}<button disabled={enviando} type="submit" className="w-full bg-white disabled:opacity-60 text-black font-bold py-3 rounded-lg active:scale-95 transition mt-2">{enviando ? 'Entrando...' : 'Entrar'}</button></form>
      <p className="text-center text-xs text-gray-400">Não tem uma conta? <Link href="/cadastro" className="text-blue-500 font-semibold hover:underline">Cadastre-se</Link></p></div>
  </div>;
}
