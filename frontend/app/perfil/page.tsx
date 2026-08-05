'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, encerrarSessao, type Usuario } from '../../lib/api';

const formatarData = (data: string) => data ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T12:00:00`)) : '--/--/----';

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(() => typeof window === 'undefined' ? '/avatar-padrao.png' : localStorage.getItem('@forceAcademia:fotoPerfil') ?? '/avatar-padrao.png');

  useEffect(() => {
    apiFetch<{ user: Usuario }>('/api/me').then(({ user }) => setUsuario(user)).catch((error) => setErro(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.'));
  }, []);

  function alterarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]; if (!arquivo) return;
    const reader = new FileReader(); reader.onloadend = () => { const foto = reader.result as string; setFotoPerfil(foto); localStorage.setItem('@forceAcademia:fotoPerfil', foto); }; reader.readAsDataURL(arquivo);
  }
  function sair() { encerrarSessao(); localStorage.removeItem('@forceAcademia:fotoPerfil'); window.location.href = '/login'; }

  if (!usuario) return <div className="bg-black min-h-screen text-white flex items-center justify-center font-sans"><div className="text-center space-y-3"><p className="text-sm font-bold tracking-widest uppercase animate-pulse">Carregando Perfil...</p>{erro && <><p className="text-xs text-red-400">{erro}</p><Link className="text-xs text-blue-400 underline" href="/login">Ir para o login</Link></>}</div></div>;
  const dados = [{ titulo: 'Idade', valor: usuario.idade ? `${usuario.idade} anos` : 'Não informada' }, { titulo: 'Peso', valor: usuario.peso ? `${usuario.peso} kg` : 'Não informado' }, { titulo: 'Altura', valor: usuario.altura ? `${usuario.altura} m` : 'Não informada' }];
  return <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between"><header className="border-b border-blue-500/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50"><div className="flex items-center justify-between max-w-md mx-auto"><Link href="/" className="text-blue-500 text-sm font-bold hover:text-white transition">⬅ Voltar</Link><h1 className="text-sm font-black uppercase tracking-widest text-white">MEU <span className="text-blue-500">PERFIL</span></h1><div className="w-10" /></div></header>
    <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 space-y-6"><div className="flex flex-col items-center space-y-3"><div className="w-24 h-24 bg-zinc-900 border-2 border-blue-500 rounded-full overflow-hidden"><img src={fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div><label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-blue-500 text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">Alterar Foto<input type="file" accept="image/*" onChange={alterarFoto} className="hidden" /></label><p className="text-sm font-bold">{usuario.nome}</p><p className="text-[10px] text-gray-500">Matrícula: {usuario.matricula}</p></div>
      <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3"><h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-zinc-900 pb-2">Informações do Plano</h3><Linha titulo="Plano Atual" valor={usuario.plano} /><Linha titulo="Status" valor={usuario.status} /><Linha titulo="Próximo Vencimento" valor={formatarData(usuario.vencimento)} /></section>
      <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3"><h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-zinc-900 pb-2">Avaliação Física Rápida</h3><div className="grid grid-cols-3 gap-2 text-center">{dados.map((d) => <div key={d.titulo} className="bg-black p-2 rounded-lg border border-zinc-900"><span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">{d.titulo}</span><span className="text-xs font-bold text-white">{d.valor}</span></div>)}</div></section>
      <button onClick={sair} className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:text-red-400 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider">Sair</button></main><footer className="border-t border-zinc-900 py-4 text-center text-[10px] text-gray-600">FORCE ACADEMIA • Área do Aluno</footer></div>;
}
function Linha({ titulo, valor }: { titulo: string; valor: string }) { return <div className="flex justify-between text-xs"><span className="text-gray-400">{titulo}:</span><span className="font-bold text-white">{valor}</span></div>; }
