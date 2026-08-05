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
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function lidarComCadastro(e: React.FormEvent) {
    e.preventDefault(); setErro(''); setEnviando(true);
    try {
      const resposta = await apiFetch<{ token: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ nome, email, senha, idade: idade || null, peso: peso || null, altura: altura || null }) });
      salvarSessao(resposta.token);
      router.push('/perfil');
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível criar sua conta.'); }
    finally { setEnviando(false); }
  }

  return <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-center items-center px-4 py-8 relative">
    <div className="w-full max-w-md mb-4 text-left"><Link href="/" className="text-sm font-bold text-blue-500 hover:text-white transition flex items-center gap-1">⬅ Voltar para o Início</Link></div>
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
      <div className="text-center space-y-2"><h2 className="text-2xl font-black uppercase tracking-tight">FORCE<span className="text-blue-500">ACADEMIA</span></h2><p className="text-sm text-gray-400">Crie sua conta e comece hoje</p></div>
      <form onSubmit={lidarComCadastro} className="space-y-4">
        <Campo label="Nome Completo" value={nome} onChange={setNome} placeholder="Seu nome" />
        <Campo label="E-mail" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
        <Campo label="Senha" type="password" value={senha} onChange={setSenha} placeholder="Mínimo 6 caracteres" />
        <div className="grid grid-cols-3 gap-2"><Campo label="Idade" type="number" required={false} value={idade} onChange={setIdade} placeholder="24" small /><Campo label="Peso (kg)" type="number" required={false} value={peso} onChange={setPeso} placeholder="75" small /><Campo label="Altura (m)" required={false} value={altura} onChange={setAltura} placeholder="1.75" small /></div>
        {erro && <p className="text-xs text-red-400 text-center">{erro}</p>}
        <button disabled={enviando} type="submit" className="w-full bg-white disabled:opacity-60 text-black font-bold py-3 rounded-lg active:scale-95 transition mt-2 hover:bg-gray-200">{enviando ? 'Criando conta...' : 'Criar Minha Conta'}</button>
      </form>
      <p className="text-center text-xs text-gray-400">Já possui cadastro? <Link href="/login" className="text-blue-500 font-semibold hover:underline">Fazer Login</Link></p>
    </div>
  </div>;
}

function Campo({ label, type = 'text', value, onChange, placeholder, required = true, small = false }: { label: string; type?: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; small?: boolean }) {
  return <div><label className={`block font-bold uppercase tracking-wide text-gray-400 mb-1 ${small ? 'text-[10px]' : 'text-xs'}`}>{label}</label><input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded-lg outline-none transition ${small ? 'p-2.5 text-xs' : 'p-3 text-sm'}`} /></div>;
}
