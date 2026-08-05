'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

interface Exercicio {
  id: string;
  nome: string;
  series: string;
  repeticoes: string;
  editando?: boolean; // Controla se o exercício está em modo edição ou visualização
}

interface DiaSemana {
  id: string;
  dia: string;
  foco: string;
  exercicios: Exercicio[];
}

interface FichaTreino {
  id: string;
  nome: string;
  dias: DiaSemana[];
}

const criarDiasPadrao = (): DiaSemana[] => [
  { id: 'seg', dia: 'Segunda-feira', foco: '', exercicios: [] },
  { id: 'ter', dia: 'Terça-feira', foco: '', exercicios: [] },
  { id: 'qua', dia: 'Quarta-feira', foco: '', exercicios: [] },
  { id: 'qui', dia: 'Quinta-feira', foco: '', exercicios: [] },
  { id: 'sex', dia: 'Sexta-feira', foco: '', exercicios: [] },
];

export default function TreinoPersonalizadoPage() {
  const [fichas, setFichas] = useState<FichaTreino[]>([]);
  const [treinoAbertoId, setTreinoAbertoId] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    apiFetch<{ workouts: FichaTreino[] }>('/api/workouts')
      .then(({ workouts }) => setFichas(workouts))
      .catch((error) => setErro(error instanceof Error ? error.message : 'Não foi possível carregar os treinos.'));
  }, []);

  const salvarFichas = async () => {
    // Garante que todos os exercícios fiquem salvos e fora do modo edição
    const fichasSalvas = fichas.map((f) => ({
      ...f,
      dias: f.dias.map((d) => ({
        ...d,
        exercicios: d.exercicios.map((e) => ({ ...e, editando: false })),
      })),
    }));

    setFichas(fichasSalvas);
    try {
      await Promise.all(fichasSalvas.map((ficha) => apiFetch(`/api/workouts/${ficha.id}`, { method: 'PUT', body: JSON.stringify({ nome: ficha.nome, dias: ficha.dias }) })));
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível salvar os treinos.'); }
  };

  const adicionarNovoTreino = async () => {
    const treinoBase = {
      nome: `Treino ${fichas.length + 1}`,
      dias: criarDiasPadrao(),
    };
    try {
      const { workout } = await apiFetch<{ workout: FichaTreino }>('/api/workouts', { method: 'POST', body: JSON.stringify(treinoBase) });
      setFichas([...fichas, workout]);
      setTreinoAbertoId(workout.id);
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível criar o treino.'); }
  };

  const deletarTreino = async (idTreino: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiFetch(`/api/workouts/${idTreino}`, { method: 'DELETE' });
      setFichas(fichas.filter((f) => f.id !== idTreino));
      if (treinoAbertoId === idTreino) setTreinoAbertoId(null);
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível excluir o treino.'); }
  };

  const atualizarNomeTreino = (idTreino: string, novoNome: string) => {
    setFichas(
      fichas.map((f) => (f.id === idTreino ? { ...f, nome: novoNome } : f))
    );
  };

  const atualizarFocoDia = (idTreino: string, idDia: string, novoFoco: string) => {
    setFichas(
      fichas.map((f) => {
        if (f.id === idTreino) {
          const diasAt = f.dias.map((d) =>
            d.id === idDia ? { ...d, foco: novoFoco } : d
          );
          return { ...f, dias: diasAt };
        }
        return f;
      })
    );
  };

  const adicionarExercicio = (idTreino: string, idDia: string) => {
    setFichas(
      fichas.map((f) => {
        if (f.id === idTreino) {
          const diasAt = f.dias.map((d) => {
            if (d.id === idDia) {
              const novoEx: Exercicio = {
                id: Date.now().toString(),
                nome: '',
                series: '3',
                repeticoes: '12',
                editando: true, // Já abre em modo de edição
              };
              return { ...d, exercicios: [...d.exercicios, novoEx] };
            }
            return d;
          });
          return { ...f, dias: diasAt };
        }
        return f;
      })
    );
  };

  const alternarEdicaoExercicio = (idTreino: string, idDia: string, idExercicio: string) => {
    setFichas(
      fichas.map((f) => {
        if (f.id === idTreino) {
          const diasAt = f.dias.map((d) => {
            if (d.id === idDia) {
              const exAt = d.exercicios.map((e) =>
                e.id === idExercicio ? { ...e, editando: !e.editando } : e
              );
              return { ...d, exercicios: exAt };
            }
            return d;
          });
          return { ...f, dias: diasAt };
        }
        return f;
      })
    );
  };

  const deletarExercicio = (idTreino: string, idDia: string, idExercicio: string) => {
    setFichas(
      fichas.map((f) => {
        if (f.id === idTreino) {
          const diasAt = f.dias.map((d) => {
            if (d.id === idDia) {
              return {
                ...d,
                exercicios: d.exercicios.filter((e) => e.id !== idExercicio),
              };
            }
            return d;
          });
          return { ...f, dias: diasAt };
        }
        return f;
      })
    );
  };

  const atualizarExercicio = (
    idTreino: string,
    idDia: string,
    idExercicio: string,
    campo: keyof Exercicio,
    valor: string
  ) => {
    setFichas(
      fichas.map((f) => {
        if (f.id === idTreino) {
          const diasAt = f.dias.map((d) => {
            if (d.id === idDia) {
              const exAt = d.exercicios.map((e) =>
                e.id === idExercicio ? { ...e, [campo]: valor } : e
              );
              return { ...d, exercicios: exAt };
            }
            return d;
          });
          return { ...f, dias: diasAt };
        }
        return f;
      })
    );
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between">
      {/* HEADER */}
      <header className="border-b border-blue-500/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/" className="text-blue-500 text-sm font-bold hover:text-white transition">
            ⬅ Voltar
          </Link>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            TREINOS <span className="text-blue-500">PERSONALIZADOS</span>
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 space-y-6">
        <div className="flex items-center justify-between border-l-4 border-blue-500 pl-2">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Meus Treinos</h2>
            <p className="text-xs text-gray-400">Crie e organize suas fichas de treino.</p>
          </div>

          <button
            onClick={adicionarNovoTreino}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition active:scale-95"
          >
            + Criar Treino
          </button>
        </div>

        {salvo && (
          <div className="bg-green-500/10 border border-green-500/40 text-green-400 text-xs font-bold p-3 rounded-lg text-center">
            ✓ Todos os treinos foram salvos!
          </div>
        )}

        {erro && <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold p-3 rounded-lg text-center">{erro}</div>}

        {/* LISTA DE FICHAS */}
        {fichas.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center space-y-3">
            <p className="text-gray-400 text-xs">Nenhum treino criado ainda.</p>
            <button
              onClick={adicionarNovoTreino}
              className="bg-blue-500/10 border border-blue-500/40 text-blue-400 hover:bg-blue-500/20 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition"
            >
              Criar Treino 1
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fichas.map((ficha) => {
              const estaAberto = treinoAbertoId === ficha.id;

              return (
                <div key={ficha.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  
                  {/* CABEÇALHO DA FICHA */}
                  <div
                    onClick={() => setTreinoAbertoId(estaAberto ? null : ficha.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-900/50 transition border-b border-zinc-900"
                  >
                    <input
                      type="text"
                      value={ficha.nome}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => atualizarNomeTreino(ficha.id, e.target.value)}
                      placeholder="Nome do Treino"
                      className="bg-transparent font-black text-sm text-blue-500 uppercase outline-none w-full"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => deletarTreino(ficha.id, e)}
                        className="text-gray-500 hover:text-red-400 text-xs p-1"
                        title="Deletar Treino"
                      >
                        🗑️
                      </button>
                      <span className="text-xs text-gray-400">{estaAberto ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* DIAS DE SEGUNDA A SEXTA */}
                  {estaAberto && (
                    <div className="p-4 space-y-5 bg-black/40">
                      {ficha.dias.map((d) => (
                        <div key={d.id} className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 space-y-3">
                          
                          {/* DIA DA SEMANA E FOCO */}
                          <div className="border-b border-zinc-800 pb-2 space-y-1">
                            <span className="text-[11px] font-black uppercase text-blue-400 block">
                              {d.dia}
                            </span>
                            <input
                              type="text"
                              value={d.foco}
                              onChange={(e) => atualizarFocoDia(ficha.id, d.id, e.target.value)}
                              placeholder="Ex: Peito, Tríceps e Ombro"
                              className="bg-transparent text-xs text-white placeholder-zinc-600 outline-none w-full"
                            />
                          </div>

                          {/* LISTA DE EXERCÍCIOS */}
                          <div className="space-y-2">
                            {d.exercicios.length === 0 ? (
                              <p className="text-[10px] text-gray-500 italic text-center py-1">
                                Sem exercícios.
                              </p>
                            ) : (
                              d.exercicios.map((ex) => (
                                <div key={ex.id} className="bg-black border border-zinc-800 p-2.5 rounded-lg">
                                  {ex.editando ? (
                                    /* MODALIDADE: EDIÇÃO (CAMPOS DE DIGITAÇÃO) */
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={ex.nome}
                                        onChange={(e) => atualizarExercicio(ficha.id, d.id, ex.id, 'nome', e.target.value)}
                                        placeholder="Nome do Exercício"
                                        className="w-full bg-zinc-900 text-xs text-white p-2 rounded border border-zinc-800 outline-none focus:border-blue-500"
                                      />

                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-gray-400 font-bold">S:</span>
                                            <input
                                              type="text"
                                              value={ex.series}
                                              onChange={(e) => atualizarExercicio(ficha.id, d.id, ex.id, 'series', e.target.value)}
                                              placeholder="3"
                                              className="bg-zinc-900 text-xs text-center text-white p-1.5 rounded border border-zinc-800 outline-none w-10 focus:border-blue-500"
                                            />
                                          </div>

                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-gray-400 font-bold">R:</span>
                                            <input
                                              type="text"
                                              value={ex.repeticoes}
                                              onChange={(e) => atualizarExercicio(ficha.id, d.id, ex.id, 'repeticoes', e.target.value)}
                                              placeholder="12"
                                              className="bg-zinc-900 text-xs text-center text-white p-1.5 rounded border border-zinc-800 outline-none w-12 focus:border-blue-500"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => alternarEdicaoExercicio(ficha.id, d.id, ex.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase py-1 px-3 rounded transition"
                                          >
                                            OK
                                          </button>
                                          <button
                                            onClick={() => deletarExercicio(ficha.id, d.id, ex.id)}
                                            className="text-gray-500 hover:text-red-400 text-xs p-1"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    /* MODALIDADE: VISUALIZAÇÃO (FORMATO LIMPO) */
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs font-semibold text-white">
                                        {ex.nome || 'Exercício sem nome'}{' '}
                                        <span className="text-blue-400 font-bold ml-2">
                                          S: {ex.series || '0'} R: {ex.repeticoes || '0'}
                                        </span>
                                      </p>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => alternarEdicaoExercicio(ficha.id, d.id, ex.id)}
                                          className="text-gray-400 hover:text-blue-400 text-xs p-1"
                                          title="Editar Exercício"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => deletarExercicio(ficha.id, d.id, ex.id)}
                                          className="text-gray-500 hover:text-red-400 text-xs p-1"
                                          title="Excluir Exercício"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>

                          <button
                            onClick={() => adicionarExercicio(ficha.id, d.id)}
                            className="w-full bg-zinc-950 hover:bg-black border border-zinc-800 text-blue-400 text-[10px] font-bold py-1.5 rounded transition uppercase"
                          >
                            + Exercício
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={salvarFichas}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-lg active:scale-95 transition"
            >
              💾 Salvar Todos os Treinos
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-4 text-center text-[10px] text-gray-600">
        OMEGA GYM • Rotina Personalizada
      </footer>
    </div>
  );
}
