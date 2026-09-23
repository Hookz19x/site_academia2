'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HidratacaoPage() {
  const [coposTomados, setCoposTomados] = useState<number>(0);
  const [pesoInput, setPesoInput] = useState<string>('');

  const mlsPorCopo = 250;

  const getTodayKey = () => {
    const today = new Date();
    return `@omegaGym:agua_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const getWeightKey = () => '@omegaGym:peso_agua';

  useEffect(() => {
    // 1. Tentar pegar o peso salvo localmente
    try {
      const pesoSalvo = localStorage.getItem(getWeightKey());
      if (pesoSalvo) {
        setPesoInput(pesoSalvo);
      }
    } catch { }

    // 2. Buscar da API para sobrescrever com dados reais do perfil (se logado)
    import('../../lib/api').then(({ apiFetch }) => {
      apiFetch<{ user: any }>('/api/me')
        .then(({ user }) => {
          if (user?.peso) {
            setPesoInput(String(user.peso));
            try { localStorage.setItem(getWeightKey(), String(user.peso)); } catch { }
          }
        })
        .catch(() => { });
    });

    // 3. Pegar copos
    try {
      const salvo = localStorage.getItem(getTodayKey());
      if (salvo !== null) {
        setCoposTomados(parseInt(salvo, 10) || 0);
      }
    } catch { }
  }, []);

  const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPesoInput(val);
    try { localStorage.setItem(getWeightKey(), val); } catch { }
  };

  const atualizarCopos = (novoValor: number) => {
    setCoposTomados(novoValor);
    try {
      localStorage.setItem(getTodayKey(), String(novoValor));
    } catch { }
  };

  const alternarCopo = (index: number) => {
    if (index < coposTomados) {
      atualizarCopos(index);
    } else {
      atualizarCopos(index + 1);
    }
  };

  const resetarProgresso = () => {
    atualizarCopos(0);
  };

  const pesoNum = parseFloat(pesoInput);
  const metaML = (!isNaN(pesoNum) && pesoNum > 0) ? Math.round(pesoNum * 35) : 3000;

  const restoML = metaML % mlsPorCopo;
  const numCoposCheios = Math.floor(metaML / mlsPorCopo);
  const totalCopos = numCoposCheios + (restoML > 0 ? 1 : 0);

  const coposArray = Array.from({ length: totalCopos }).map((_, index) => {
    return (index === totalCopos - 1 && restoML > 0) ? restoML : mlsPorCopo;
  });

  const totalML = coposArray.slice(0, coposTomados).reduce((a, b) => a + b, 0);
  const porcentagem = Math.min((totalML / metaML) * 100, 100);

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between">

      {/* HEADER */}
      <header className="border-b border-blue-500/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/" className="text-blue-500 text-sm font-bold hover:text-white transition">
            ⬅ Voltar
          </Link>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            CONTROLE DE <span className="text-blue-500">ÁGUA</span>
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-center space-y-6">

        {/* Painel de Peso */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Seu Peso (kg)
            </label>
            <p className="text-[10px] text-gray-500">Para calcular os \~35ml/kg</p>
          </div>
          <input
            type="number"
            value={pesoInput}
            onChange={handlePesoChange}
            placeholder="Ex: 70"
            className="bg-black border border-zinc-700 text-white font-bold rounded-lg p-2 w-24 text-center focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Painel de Status */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>💧</div>
          <div>
            <h2 className="text-2xl font-black text-white">
              {totalML >= metaML ? '🎉 META CONCLUÍDA!' : `${(totalML / 1000).toFixed(2)}L / ${(metaML / 1000).toFixed(2)}L`}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Você tomou <span className="text-blue-500 font-bold">{coposTomados}</span> de <span className="text-white font-bold">{totalCopos}</span> copos
            </p>
          </div>

          {/* Barra de Progresso Visual */}
          <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-blue-500 h-full transition-all duration-500 shadow-lg shadow-blue-500/50"
              style={{ width: `${porcentagem}%` }}
            ></div>
          </div>
        </div>

        {/* Grade Interativa com os Copos */}
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
            Clique nos copos para registrar
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl max-h-64 overflow-y-auto">
            {coposArray.map((volumeCopo, index) => {
              const ativo = index < coposTomados;
              return (
                <button
                  key={index}
                  onClick={() => alternarCopo(index)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${ativo
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold shadow-md shadow-blue-500/10'
                      : 'bg-black border-zinc-800 text-gray-600 hover:border-zinc-700 cursor-pointer'
                    }`}
                >
                  <span className={`text-xl transition-transform ${ativo ? 'scale-110' : 'opacity-40'}`}>
                    🥛
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter">{volumeCopo}mL</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botão para Resetar o dia */}
        <button
          onClick={resetarProgresso}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/40 hover:text-red-400 text-gray-400 text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
        >
          Limpar Registro de Hoje
        </button>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-4 text-center text-[10px] text-gray-600">
        ÔMEGA GYM • Saúde & Performance
      </footer>

    </div>
  );
}
