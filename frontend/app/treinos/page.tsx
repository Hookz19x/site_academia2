'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch, type Usuario } from '../../lib/api';

export default function TreinosPage() {
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<number[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [treinoAbertoId, setTreinoAbertoId] = useState<string | null>("t1");

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

  // Nova Estrutura de treinos da academia (separados por Treino -> Dias da Semana)
  const listaTreinos = [
    {
      id: "t1",
      nome: "Treino 1",
      dias: [
        {
          id: "t1-seg",
          dia: "Segunda-feira",
          foco: "Peito e Tríceps",
          exercicios: [
            { id: 1, nome: "Supino Reto com Barra", series: "4x", reps: "10 a 12" },
            { id: 2, nome: "Supino Inclinado com Halteres", series: "3x", reps: "12" },
            { id: 3, nome: "Crucifixo Máquina (Peck Deck)", series: "3x", reps: "15" },
            { id: 4, nome: "Tríceps Pulley (Corda)", series: "4x", reps: "12" },
            { id: 5, nome: "Tríceps Testa com Halteres", series: "3x", reps: "10" },
          ]
        },
        {
          id: "t1-ter",
          dia: "Terça-feira",
          foco: "Costas e Bíceps",
          exercicios: [
            { id: 6, nome: "Puxada Alta na Polia", series: "4x", reps: "10" },
            { id: 7, nome: "Remada Baixa Sentado", series: "3x", reps: "12" },
            { id: 8, nome: "Pull Down com Corda", series: "3x", reps: "15" },
            { id: 9, nome: "Rosca Direta com Barra W", series: "4x", reps: "10" },
            { id: 10, nome: "Rosca Alternada com Halteres", series: "3x", reps: "12" },
          ]
        },
        {
          id: "t1-qua",
          dia: "Quarta-feira",
          foco: "Descanso",
          exercicios: [] // Dia de descanso (sem exercícios)
        },
        {
          id: "t1-qui",
          dia: "Quinta-feira",
          foco: "Pernas Completas",
          exercicios: [
            { id: 11, nome: "Agachamento Livre", series: "4x", reps: "10" },
            { id: 12, nome: "Leg Press 45º", series: "3x", reps: "12" },
            { id: 13, nome: "Cadeira Extensora", series: "3x", reps: "15" },
            { id: 14, nome: "Mesa Flexora", series: "4x", reps: "12" },
          ]
        },
        {
          id: "t1-sex",
          dia: "Sexta-feira",
          foco: "Ombros e Abdômen",
          exercicios: [
            { id: 15, nome: "Desenvolvimento com Halteres", series: "4x", reps: "10" },
            { id: 16, nome: "Elevação Lateral na Polia", series: "4x", reps: "12" },
            { id: 17, nome: "Abdominal Crunch", series: "4x", reps: "20" },
            { id: 18, nome: "Prancha Isométrica", series: "3x", reps: "60s" }
          ]
        }
      ]
    },
    {
      id: "t2",
      nome: "Treino 2",
      dias: [
        {
          id: "t2-seg",
          dia: "Segunda-feira",
          foco: "Quadríceps e Panturrilhas",
          exercicios: [
            { id: 19, nome: "Agachamento Búlgaro", series: "3x", reps: "10" },
            { id: 20, nome: "Cadeira Extensora", series: "4x", reps: "12" },
            { id: 21, nome: "Panturrilha em Pé", series: "4x", reps: "15" }
          ]
        },
        {
          id: "t2-ter",
          dia: "Terça-feira",
          foco: "Costas e Posterior de Ombro",
          exercicios: [
            { id: 22, nome: "Barra Fixa ou Graviton", series: "3x", reps: "8 a 10" },
            { id: 23, nome: "Remada Curvada", series: "4x", reps: "10" },
            { id: 24, nome: "Crucifixo Inverso", series: "3x", reps: "12" }
          ]
        },
        {
          id: "t2-qua",
          dia: "Quarta-feira",
          foco: "Descanso",
          exercicios: []
        },
        {
          id: "t2-qui",
          dia: "Quinta-feira",
          foco: "Posterior de Coxa e Glúteos",
          exercicios: [
            { id: 25, nome: "Stiff", series: "4x", reps: "10" },
            { id: 26, nome: "Mesa Flexora", series: "4x", reps: "12" },
            { id: 27, nome: "Elevação Pélvica", series: "4x", reps: "10" }
          ]
        },
        {
          id: "t2-sex",
          dia: "Sexta-feira",
          foco: "Peito, Bíceps e Ombro",
          exercicios: [
            { id: 28, nome: "Supino Reto com Halteres", series: "3x", reps: "10" },
            { id: 29, nome: "Rosca Direta", series: "3x", reps: "10" },
            { id: 30, nome: "Elevação Frontal", series: "3x", reps: "12" }
          ]
        }
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

  const totalExercicios = listaTreinos.reduce((acc, treino) => 
    acc + treino.dias.reduce((accDia, dia) => accDia + dia.exercicios.length, 0), 
  0);

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
              {usuario ? usuario.nome : 'Aluno ÔMEGA GYM'}
            </h2>
            <p className="text-[11px] text-gray-400">
              {usuario ? `Matrícula: ${usuario.matricula} • ${usuario.plano}` : 'Objetivo: Hipertrofia Geral'}
            </p>
          </div>
          <span className="text-[10px] bg-blue-500/10 border border-blue-500/40 text-blue-500 px-2 py-1 rounded font-bold uppercase">
            {exerciciosConcluidos.length}/{totalExercicios} Feitos
          </span>
        </div>

        {/* Mapeamento das Rotinas de Treino Expandível */}
        <div className="space-y-4">
          {listaTreinos.map((treino) => {
            const estaAberto = treinoAbertoId === treino.id;

            return (
              <div key={treino.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
                {/* CABEÇALHO DO TREINO (ex: Treino 1) */}
                <div
                  onClick={() => setTreinoAbertoId(estaAberto ? null : treino.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50 transition border-b border-zinc-900 select-none"
                >
                  <h3 className="font-black text-sm text-blue-500 uppercase">
                    {treino.nome}
                  </h3>
                  <span className="text-xs text-gray-400">{estaAberto ? '▲' : '▼'}</span>
                </div>

                {estaAberto && (
                  <div className="p-4 space-y-5 bg-black/40">
                    {/* DIAS DE SEGUNDA A SEXTA */}
                    {treino.dias.map((dia) => (
                      <div key={dia.id} className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 space-y-3">
                        <div className="border-b border-zinc-800 pb-2 space-y-1">
                          <span className="text-[11px] font-black uppercase text-blue-400 block">
                            {dia.dia}
                          </span>
                          <span className="text-xs text-gray-400">{dia.foco}</span>
                        </div>

                        <div className="space-y-2">
                          {dia.exercicios.length === 0 ? (
                            <p className="text-[10px] text-gray-500 italic text-center py-2">
                              Dia de Descanso. Recupere as energias! ⚡
                            </p>
                          ) : (
                            dia.exercicios.map((ex) => {
                              const estahConcluido = exerciciosConcluidos.includes(ex.id);
                              return (
                                <div 
                                  key={ex.id} 
                                  className={`bg-zinc-950 border rounded-xl p-3 flex items-center justify-between transition-colors ${estahConcluido ? 'border-green-500/40 bg-green-500/5' : 'border-zinc-800'}`}
                                >
                                  <div className="space-y-1 pr-2">
                                    <h4 className={`text-xs font-bold transition-all ${estahConcluido ? 'text-gray-500 line-through' : 'text-white'}`}>
                                      {ex.nome}
                                    </h4>
                                    <p className="text-[11px] text-gray-400">
                                      Séries: <span className="text-white font-semibold">{ex.series}</span> | Reps: <span className="text-white font-semibold">{ex.reps}</span>
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => alternarConclusao(ex.id)}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider transition-all min-w-[70px] ${estahConcluido ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                                  >
                                    {estahConcluido ? '✓ Feito' : 'Concluir'}
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão para Resetar o Treino do dia se necessário */}
        {exerciciosConcluidos.length > 0 && (
          <button 
            onClick={resetarConcluidos}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/40 hover:text-red-400 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
          >
            Limpar Marcações de Treino
          </button>
        )}

      </main>

      {/* RODAPÉ SIMPLIFICADO */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[10px] text-gray-600">
        © {new Date().getFullYear()} ÔMEGA GYM. Bons treinos!
      </footer>

    </div>
  );
}