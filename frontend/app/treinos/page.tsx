'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch, type Usuario } from '../../lib/api';

export default function TreinosPage() {
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<number[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const getTodayKey = () => {
    const today = new Date();
    return `@omegaGym:treinosConcluidos_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Carrega dados do usuário logado
    apiFetch<{ user: Usuario }>('/api/me')
      .then(({ user }) => setUsuario(user))
      .catch(() => {
        // Usuário visitante / não autenticado
      });

    // Carrega exercícios concluídos salvos do dia
    try {
      const salvos = localStorage.getItem(getTodayKey());
      if (salvos) {
        setExerciciosConcluidos(JSON.parse(salvos));
      }
    } catch {
      // Ignora erro
    }
  }, []);

  const salvarConcluidos = (novaLista: number[]) => {
    setExerciciosConcluidos(novaLista);
    try {
      localStorage.setItem(getTodayKey(), JSON.stringify(novaLista));
    } catch {
      // Ignora erro
    }
  };

  // Lista padrão de treinos da academia
  const listaTreinos = [
    {
      rotina: "Treino A - Peito e Tríceps",
      exercicios: [
        { id: 1, nome: "Supino Reto com Barra", series: "4x", reps: "10 a 12" },
        { id: 2, nome: "Supino Inclinado com Halteres", series: "3x", reps: "12" },
        { id: 3, nome: "Crucifixo Máquina (Peck Deck)", series: "3x", reps: "15" },
        { id: 4, nome: "Tríceps Pulley (Corda)", series: "4x", reps: "12" },
        { id: 5, nome: "Tríceps Testa com Halteres", series: "3x", reps: "10" },
      ]
    },
    {
      rotina: "Treino B - Costas e Bíceps",
      exercicios: [
        { id: 6, nome: "Puxada Alta na Polia", series: "4x", reps: "10" },
        { id: 7, nome: "Remada Baixa Sentado", series: "3x", reps: "12" },
        { id: 8, nome: "Pull Down com Corda", series: "3x", reps: "15" },
        { id: 9, nome: "Rosca Direta com Barra W", series: "4x", reps: "10" },
        { id: 10, nome: "Rosca Alternada com Halteres", series: "3x", reps: "12" },
      ]
    },
    {
      rotina: "Treino C - Pernas Completas e Ombros",
      exercicios: [
        { id: 11, nome: "Agachamento Livre", series: "4x", reps: "10" },
        { id: 12, nome: "Leg Press 45º", series: "3x", reps: "12" },
        { id: 13, nome: "Cadeira Extensora", series: "3x", reps: "15" },
        { id: 14, nome: "Desenvolvimento com Halteres", series: "4x", reps: "10" },
        { id: 15, nome: "Elevação Lateral na Polia", series: "4x", reps: "12" },
      ]
    }
  ];

  const alternarConclusao = (id: number) => {
    let novaLista: number[];
    if (exerciciosConcluidos.includes(id)) {
      novaLista = exerciciosConcluidos.filter(item => item !== id);
    } else {
      novaLista = [...exerciciosConcluidos, id];
    }
    salvarConcluidos(novaLista);
  };

  const resetarConcluidos = () => {
    salvarConcluidos([]);
  };

  const totalExercicios = listaTreinos.reduce((acc, curr) => acc + curr.exercicios.length, 0);

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between">
      
      {/* HEADER / TOPO */}
      <header className="border-b border-blue-500/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-blue-500 text-lg hover:text-white transition">
              ⬅ Voltar
            </Link>
          </div>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            MINHA <span className="text-blue-500">FICHA</span>
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 space-y-8">
        
        {/* Cabeçalho do Aluno */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white">
              {usuario ? usuario.nome : 'Aluno OMEGA GYM'}
            </h2>
            <p className="text-[11px] text-gray-400">
              {usuario ? `Matrícula: ${usuario.matricula} • ${usuario.plano}` : 'Objetivo: Hipertrofia Geral'}
            </p>
          </div>
          <span className="text-[10px] bg-blue-500/10 border border-blue-500/40 text-blue-500 px-2 py-1 rounded font-bold uppercase">
            {exerciciosConcluidos.length}/{totalExercicios} Feitos
          </span>
        </div>

        {/* Mapeamento das Rotinas de Treino (A, B, C) */}
        {listaTreinos.map((rotina, index) => (
          <section key={index} className="space-y-4">
            <h3 className="text-sm font-black uppercase text-blue-500 border-l-4 border-blue-500 pl-2 tracking-wide">
              {rotina.rotina}
            </h3>

            <div className="space-y-3">
              {rotina.exercicios.map((ex) => {
                const estahConcluido = exerciciosConcluidos.includes(ex.id);
                return (
                  <div 
                    key={ex.id} 
                    className={`bg-zinc-950 border rounded-xl p-4 flex items-center justify-between transition-colors ${estahConcluido ? 'border-green-500/40 bg-green-500/5' : 'border-zinc-800'}`}
                  >
                    <div className="space-y-1 pr-2">
                      <h4 className={`text-xs font-bold transition-all ${estahConcluido ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {ex.nome}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Séries: <span className="text-white font-semibold">{ex.series}</span> | Reps: <span className="text-white font-semibold">{ex.reps}</span>
                      </p>
                    </div>

                    {/* Botão Checkbox Customizado */}
                    <button
                      onClick={() => alternarConclusao(ex.id)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-all ${estahConcluido ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                      {estahConcluido ? '✓ Feito' : 'Concluir'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Botão para Resetar o Treino do dia se necessário */}
        {exerciciosConcluidos.length > 0 && (
          <button 
            onClick={resetarConcluidos}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/40 hover:text-red-400 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider"
          >
            Limpar Marcações de Treino
          </button>
        )}

      </main>

      {/* RODAPÉ SIMPLIFICADO */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[10px] text-gray-600">
        © {new Date().getFullYear()} OMEGA GYM. Bons treinos!
      </footer>

    </div>
  );
}