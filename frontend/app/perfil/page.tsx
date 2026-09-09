'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, encerrarSessao, type Usuario } from '../../lib/api';

const formatarData = (data: string) => {
  if (!data) return '--/--/----';
  try {
    const d = new Date(data.includes('T') ? data : `${data}T12:00:00`);
    return isNaN(d.getTime()) ? '--/--/----' : new Intl.DateTimeFormat('pt-BR').format(d);
  } catch {
    return '--/--/----';
  }
};

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string>('/avatar-padrao.png');

  // Estado para visualização de usuários por administradores
  const [usuariosAdmin, setUsuariosAdmin] = useState<Usuario[]>([]);
  const [carregandoAdmin, setCarregandoAdmin] = useState(false);
  const [mostrarListaAdmin, setMostrarListaAdmin] = useState(false);

  useEffect(() => {
    apiFetch<{ user: Usuario }>('/api/me')
      .then(({ user }) => {
        setUsuario(user);
        const fotoSalva = localStorage.getItem(`@omegaGym:fotoPerfil_${user.id}`) || localStorage.getItem('@omegaGym:fotoPerfil');
        if (fotoSalva) setFotoPerfil(fotoSalva);
      })
      .catch((error) => {
        setErro(error instanceof Error ? error.message : 'Não foi possível carregar o perfil.');
      });
  }, []);

  function alterarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const foto = reader.result as string;
      setFotoPerfil(foto);
      if (usuario) {
        localStorage.setItem(`@omegaGym:fotoPerfil_${usuario.id}`, foto);
      }
      localStorage.setItem('@omegaGym:fotoPerfil', foto);
    };
    reader.readAsDataURL(arquivo);
  }

  function carregarUsuariosAdmin() {
    if (usuariosAdmin.length > 0) {
      setMostrarListaAdmin(!mostrarListaAdmin);
      return;
    }

    setCarregandoAdmin(true);
    apiFetch<{ users: Usuario[] }>('/api/admin/users')
      .then(({ users }) => {
        setUsuariosAdmin(users);
        setMostrarListaAdmin(true);
      })
      .catch((err) => {
        alert(err instanceof Error ? err.message : 'Erro ao listar usuários.');
      })
      .finally(() => setCarregandoAdmin(false));
  }

  function sair() {
    encerrarSessao();
    window.location.href = '/login';
  }

  if (!usuario) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Carregando Perfil...</p>
          {erro && (
            <>
              <p className="text-xs text-red-400">{erro}</p>
              <Link className="text-xs text-blue-400 underline" href="/login">
                Ir para o login
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const roleConfig = {
    aluno: {
      badge: '🎓 Aluno',
      corBorda: 'border-blue-500',
      corBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      tituloSecao: 'Área do Aluno',
    },
    personal: {
      badge: '🏋️ Personal Trainer',
      corBorda: 'border-amber-500',
      corBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      tituloSecao: 'Área Profissional',
    },
    admin: {
      badge: '🛡️ Administrador',
      corBorda: 'border-purple-500',
      corBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      tituloSecao: 'Gestão da Academia',
    },
  }[usuario.role || 'aluno'];

  const dadosFisicos = [
    { titulo: 'Idade', valor: usuario.idade ? `${usuario.idade} anos` : 'Não informada' },
    { titulo: 'Peso', valor: usuario.peso ? `${usuario.peso} kg` : 'Não informado' },
    { titulo: 'Altura', valor: usuario.altura ? `${usuario.altura} m` : 'Não informada' },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between">
      {/* HEADER */}
      <header className="border-b border-zinc-800 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/" className="text-blue-500 text-sm font-bold hover:text-white transition">
            ⬅ Voltar
          </Link>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            MEU <span className="text-blue-500">PERFIL</span>
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 space-y-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className={`w-24 h-24 bg-zinc-900 border-2 ${roleConfig.corBorda} rounded-full overflow-hidden flex items-center justify-center shadow-lg`}>
            {fotoPerfil && fotoPerfil !== '/avatar-padrao.png' ? (
              <img src={fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">
                {usuario.role === 'personal' ? '🏋️' : usuario.role === 'admin' ? '🛡️' : '👤'}
              </span>
            )}
          </div>

          <label className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-blue-500 text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full transition">
            Alterar Foto
            <input type="file" accept="image/*" onChange={alterarFoto} className="hidden" />
          </label>

          <div>
            <p className="text-base font-bold">{usuario.nome}</p>
            <p className="text-[11px] text-gray-400">{usuario.email}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Identificador: {usuario.matricula}</p>
          </div>

          {/* BADGE DE CARGO / PERFIL */}
          <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${roleConfig.corBadge}`}>
            {roleConfig.badge}
          </span>
        </div>

        {/* INFORMAÇÕES ESPECÍFICAS DE PERSONAL */}
        {usuario.role === 'personal' && (
          <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <span>📋</span> Credencial Profissional
            </h3>
            <Linha titulo="Status do Instrutor" valor="Ativo e Credenciado" />
            <Linha titulo="Registro CREF" valor={usuario.cref ? usuario.cref : 'Não informado'} />
            <Linha titulo="Tipo de Acesso" valor="Prescrição e Acompanhamento de Treinos" />
          </section>
        )}

        {/* PAINEL DE GESTÃO DO ADMINISTRADOR */}
        {usuario.role === 'admin' && (
          <section className="bg-zinc-950 border border-purple-500/30 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <span>🛡️</span> Gestão da Academia
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Você possui privilégios de Administrador Geral. Pode consultar contas registradas no sistema.
            </p>

            <button
              type="button"
              onClick={carregarUsuariosAdmin}
              disabled={carregandoAdmin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
            >
              {carregandoAdmin
                ? 'Carregando lista...'
                : mostrarListaAdmin
                ? 'Ocultar Usuários Cadastrados'
                : '👥 Ver Todos os Usuários do Sistema'}
            </button>

            {mostrarListaAdmin && (
              <div className="space-y-2 max-h-64 overflow-y-auto pt-2 border-t border-zinc-900">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Total de usuários: {usuariosAdmin.length}
                </p>
                {usuariosAdmin.map((u) => (
                  <div key={u.id} className="bg-black border border-zinc-800 p-2 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{u.nome}</p>
                      <p className="text-[10px] text-gray-500">{u.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      u.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : u.role === 'personal'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* INFORMAÇÕES DO PLANO (Para Alunos ou Geral) */}
        {usuario.role === 'aluno' && (
          <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-zinc-900 pb-2">
              Informações do Plano
            </h3>
            <Linha titulo="Plano Atual" valor={usuario.plano} />
            <Linha titulo="Status da Assinatura" valor={usuario.status} />
            <Linha titulo="Próximo Vencimento" valor={formatarData(usuario.vencimento)} />
          </section>
        )}

        {/* AVALIAÇÃO FÍSICA (Para Alunos) */}
        {usuario.role === 'aluno' && (
          <section className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-zinc-900 pb-2">
              Avaliação Física Rápida
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {dadosFisicos.map((d) => (
                <div key={d.titulo} className="bg-black p-2 rounded-lg border border-zinc-900">
                  <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">{d.titulo}</span>
                  <span className="text-xs font-bold text-white">{d.valor}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={sair}
          className="w-full text-center bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:text-red-400 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
        >
          Sair da Conta
        </button>
      </main>

      <footer className="border-t border-zinc-900 py-4 text-center text-[10px] text-gray-600">
        ÔMEGA GYM • {roleConfig.tituloSecao}
      </footer>
    </div>
  );
}

function Linha({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{titulo}:</span>
      <span className="font-bold text-white">{valor}</span>
    </div>
  );
}
