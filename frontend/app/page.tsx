'use client'; // Necessário no Next.js para componentes interativos (menu e IMC)

import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';

export default function AcademiaHome() {

    // Estados para o cálculo do BPM
  const [batimentos10s, setBatimentos10s] = useState('');
  const [bpmResultado, setBpmResultado] = useState<number | null>(null);
  const [zonaAlvo, setZonaAlvo] = useState('');

    // Variáveis do FCM
  const [idadeFcm, setIdadeFcm] = useState<string>('');
  const [fcmResultado, setFcmResultado] = useState<number | null>(null);

    // Variáveis do cronometro do bpm
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);
  const [cronometroRodando, setCronometroRodando] = useState(false);

    // Estados para controlar o menu lateral e o cálculo do IMC
  const [menuAberto, setMenuAberto] = useState(false);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imcResultado, setImcResultado] = useState<string | null>(null);
  const [imcStatus, setImcStatus] = useState('');

  // Função para calcular o IMC
  const calcularIMC = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(peso);
    const a = parseFloat(altura);

    if (p > 0 && a > 0) {
      const imc = p / (a * a);
      setImcResultado(imc.toFixed(1));

      if (imc < 18.5) setImcStatus('Abaixo do peso');
      else if (imc < 25) setImcStatus('Peso normal');
      else if (imc < 30) setImcStatus('Sobrepeso');
      else setImcStatus('Obesidade');
    }
  };
  //Função do cronometro
  const iniciarCronometro = () => {
  setTempoRestante(10);
  setCronometroRodando(true);

  const intervalo = setInterval(() => {
    setTempoRestante((tempoAtual) => {
      if (tempoAtual !== null && tempoAtual <= 1) {
        clearInterval(intervalo);
        setCronometroRodando(false);
        return 0;
      }
      return tempoAtual !== null ? tempoAtual - 1 : null;
    });
  }, 1000);
};

    //Função para calcular o FCM
  const calcularFCM = (e: React.FormEvent) => {
  e.preventDefault();
    const numIdade = parseInt(idadeFcm);
  
    if (!isNaN(numIdade) && numIdade > 0) {
    // Fórmula de Tanaka (mais precisa)
    const resultado = Math.round(208 - (0.7 * numIdade));
    setFcmResultado(resultado);
  }
};


  // Função para calcular o BPM
  const calcularBpmManual = (e: React.FormEvent) => {
  e.preventDefault();
  const contagem = parseInt(batimentos10s);
  
  if (contagem > 0) {
    const bpmCalculado = contagem * 6;
    setBpmResultado(bpmCalculado);

    if (bpmCalculado < 60) {
      setZonaAlvo('Bradicardia / Ritmo de Atleta (Baixo)');
    } else if (bpmCalculado <= 100) {
      setZonaAlvo('Coração Regular / Repouso Normal');
    } else if (bpmCalculado <= 140) {
      setZonaAlvo('Ritmo Elevado (Cardio Leve / Aquecimento)');
    } else {
      setZonaAlvo('Ritmo de Alta Intensidade / Esforço Máximo');
    }
  }
};


  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col justify-between relative overflow-x-hidden">
      
      {/* 1. HEADER / TOPO */}
      <header className="border-b border-blue-500/30 p-4 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Logo baseada na imagem */}
          <div className="flex items-center gap-2">
          {/* Aqui entra a sua logo importada da pasta public */}
          <Image 
          src="/logo.jpeg" 
          alt="Logo OMEGA GYM" 
          width={40} // Ajuste a largura como quiser
          height={40} // Ajuste a altura como quiser
          className="object-contain"
          />
  
          {/* Nome da academia do lado da logo */}
            <h2 className="text-2xl font-black uppercase tracking-tight">OMEGA<span className="text-blue-500">GYM</span>

            </h2>
            </div>
          
          {/* Botões de Acesso Rápido e as 3 Listras */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Link href="/login" className="border border-blue-500 text-blue-500 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-blue-500/10 transition">
                Entrar
              </Link>
              <Link href="/cadastro" className="bg-white text-black font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
                Cadastrar                      
              </Link>
            </div>

            {/* Botão das 3 Listras */}
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              className="text-white hover:text-blue-500 transition focus:outline-none"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 bg-white transition-transform ${menuAberto ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-opacity ${menuAberto ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-transform ${menuAberto ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MENU LATERAL RETRÁTIL (HAMBÚRGUER) */}
      <div className={`fixed top-[69px] right-0 h-full w-64 bg-zinc-800 border-2 border-black-500/20 z-40 transform transition-transform duration-300 ${menuAberto ? 'translate-x-0' : 'translate-x-full'}`}>
    <nav className="flex flex-col p-6 space-y-6 text-sm font-bold uppercase tracking-wider">
    <Link href="/perfil" onClick={() => setMenuAberto(false)} className="text-white hover:text-blue-500 transition">
    Meu Perfil
    </Link>
    <Link href="/treinos" onClick={() => setMenuAberto(false)} className="text-white hover:text-blue-500 transition">
    Treinos
    </Link>
    <Link href="/treino-personalizado" onClick={() => setMenuAberto(false)} className="text-white hover:text-blue-500 transition">Treino Personalizado</Link>
    <Link href="/hidratacao" onClick={() => setMenuAberto(false)} className="text-white hover:text-blue-500 transition">Hidrate-se</Link>
    <a href="#imc" onClick={() => setMenuAberto(false)} className="text-white hover:text-blue-500 transition">Cálculo de IMC</a>


    </nav>
      </div>

      {/* RECIPIENTE PRINCIPAL MOBILE */}
      <main className="max-w-md mx-auto w-full px-4 py-6 flex-1 space-y-12">
  
  
        {/* 2. HERO SECTION */}
        <section className="space-y-4 pt-4">                       
          <h2 className="text-3xl font-black text-white leading-tight uppercase">
            MAIS QUE UMA ACADEMIA. <br />
            <span className="text-blue-500">É UM ESTILO DE VIDA.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Aqui, você encontra o ambiente, o suporte e a motivação para superar seus limites todos os dias.
          </p>
        </section>                                                                   

        {/* 3. ESCOLA O SEU CAMINHO (TREINOS) */}
        <section id="treinos" className="space-y-6 scroll-mt-20">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Seu objetivo, nossa missão</span>
            <h3 className="text-xl font-extrabold text-white uppercase mt-1">Escolha o seu caminho</h3>
          </div>

          {/* Card 1: Treinos */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center space-y-4 shadow-lg">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500 rounded-full flex items-center justify-center mx-auto text-blue-500 text-xl">
              🏋️‍♂️
            </div>
            <h4 className="font-black text-md uppercase text-white">Treinos</h4>
            <p className="text-xs text-gray-400">Acesse treinos prontos focados em resultados reais.</p>
            <Link href="/treinos" className="block w-full bg-blue-500 text-white text-center font-bold py-2.5 text-xs rounded uppercase tracking-wider hover:bg-blue-600 transition">
             Ver Treinos
            </Link>
          </div>

          {/* Card 2: Treino Personalizado */}
          <div id="treino-personalizado" className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center space-y-4 shadow-lg scroll-mt-20">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500 rounded-full flex items-center justify-center mx-auto text-blue-500 text-xl">
              👤
            </div>
            <h4 className="font-black text-md uppercase text-white">Treino Personalizado</h4>
            <p className="text-xs text-gray-400">Tenha um plano feito especialmente para você e seus objetivos.</p>
            <Link href="/treino-personalizado" className="block w-full bg-blue-500 text-white text-center font-bold py-2.5 text-xs rounded uppercase tracking-wider hover:bg-blue-600 transition"
            >Saiba Mais</Link>
          </div>
        </section>

        {/* 4. HIDRATE-SE */}
        {/* Substitua a antiga seção id="hidrate-se" por esta: */}
    <section id="hidrate-se" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 scroll-mt-20">
      <div className="flex items-center gap-3">
      <span className="text-blue-500 text-2xl">💧</span>
      <div>
      <h4 className="font-black text-xs uppercase text-blue-500">Hidrate-se</h4>
      <p className="text-[11px] text-gray-400">Controle o consumo de água para otimizar sua recuperação muscular.</p>
      </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
    <span className="text-xs text-gray-400">Meta diária: <strong className="text-white">3 Litros</strong></span>
    
    {/* Link que leva para o painel completo */}
    <Link href="/hidratacao" className="bg-blue-500 text-white text-[11px] font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-blue-600 transition">
      Abrir Contador
    </Link>
  </div>
</section>

        {/* 5. CALCULADORA DE IMC (NOVA FUNÇÃO ADICIONADA) */}
        <section id="imc" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 scroll-mt-20">
          <div className="border-l-4 border-blue-500 pl-2">
            <h4 className="font-black text-sm uppercase text-white">Calcule seu IMC</h4>
            <p className="text-[11px] text-gray-400">Monitore sua composição corporal de forma rápida.</p>
          </div>
          
          <form onSubmit={calcularIMC} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Peso (kg)</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="Ex: 75.4" 
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded p-2 text-xs outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Altura (m)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Ex: 1.75" 
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded p-2 text-xs outline-none"
                required
              />
            </div>
            <button type="submit" className="col-span-2 bg-white text-black text-xs font-black py-2.5 rounded uppercase tracking-wider active:scale-95 transition mt-1">
              Calcular Agora
            </button>
          </form>

          {imcResultado && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-center mt-2 animate-fadeIn">
              <p className="text-xs text-gray-400">Seu IMC é: <strong className="text-white text-sm">{imcResultado}</strong></p>
              <p className="text-xs font-bold text-blue-500 uppercase mt-0.5">{imcStatus}</p>
            </div>
          )}
        </section>


        {/* CALCULADORA DE FCM */}
<section id="fcm" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
  <div className="border-l-4 border-blue-500 pl-2">
    <h4 className="font-black text-sm uppercase text-white">Frequência Cardíaca Máxima (FCM)</h4>
    <p className="text-[11px] text-gray-400">Descubra o limite teórico de batimentos do seu coração.</p>
  </div>

  <form onSubmit={calcularFCM} className="flex flex-col space-y-3">
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
        Qual é a sua idade?
      </label>
      <input 
        type="number" 
        placeholder="Ex: 25" 
        value={idadeFcm}
        onChange={(e) => setIdadeFcm(e.target.value)}
        className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded p-2 text-xs outline-none transition"
        required
      />
    </div>

    <button type="submit" className="w-full bg-white text-black text-xs font-black py-2.5 rounded uppercase tracking-wider active:scale-95 transition mt-1">
      Calcular FCM
    </button>
  </form>

  {fcmResultado && (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-center mt-2 animate-fadeIn">
      <p className="text-xs text-gray-400">Sua Frequência Cardíaca Máxima estimada é de:</p>
      <p className="text-3xl font-black text-white mt-1">
        {fcmResultado} <span className="text-xs text-blue-500 font-mono">BPM</span>
      </p>
      
      {/* Zonas de treino baseadas no resultado */}
      <div className="text-[10px] text-left text-gray-400 mt-3 space-y-1 border-t border-zinc-800 pt-2">
        <p><span className="text-green-500 font-bold">Zona Cardio Leve (60-70%):</span> {Math.round(fcmResultado * 0.6)} - {Math.round(fcmResultado * 0.7)} BPM</p>
        <p><span className="text-yellow-500 font-bold">Zona Aeróbica (70-80%):</span> {Math.round(fcmResultado * 0.7)} - {Math.round(fcmResultado * 0.8)} BPM</p>
        <p><span className="text-red-500 font-bold">Zona de Pico (85-100%):</span> {Math.round(fcmResultado * 0.85)} - {fcmResultado} BPM</p>
      </div>
    </div>
  )}
</section>

        
        {/* CALCULADORA DE BPM MANUAL */}
<section id="bpm" className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 scroll-mt-20">
  <div className="border-l-4 border-blue-500 pl-2">
    <h4 className="font-black text-sm uppercase text-white">Calculadora de BPM</h4>
    <p className="text-[11px] text-gray-400">Meça sua pulsação usando o método dos 10 segundos.</p>
  </div>
  
  <form onSubmit={calcularBpmManual} className="flex flex-col space-y-3">
  
  {/* BLOCO DO CRONÔMETRO (O QUE JÁ ESTÁ AI) */}
  <div className="bg-black border border-zinc-900 p-3 rounded-lg mb-2 text-center space-y-2">
    <p className="text-[11px] text-gray-400 leading-relaxed">
      Encontre seu pulso e clique no botão abaixo para iniciar a contagem de 10 segundos.
    </p>
    
    <div className="flex flex-col items-center justify-center gap-2 pt-1">
      <button
        type="button"
        disabled={cronometroRodando}
        onClick={iniciarCronometro}
        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
          cronometroRodando
            ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
        }`}
      >
        {cronometroRodando ? 'Contando...' : 'Iniciar 10 Segundos'}
      </button>

      {tempoRestante !== null && (
        <div className="text-xs font-mono">
          {tempoRestante > 0 ? (
            <span className="text-yellow-500 font-bold animate-pulse">Tempo restante: {tempoRestante}s</span>
          ) : (
            <span className="text-green-500 font-black uppercase tracking-wider">⏱️ Fim! Digite quantos batimentos contou.</span>
          )}
        </div>
      )}
    </div>
  </div>

  {/* CAIXINHA DE ENTRADA QUE ESTAVA FALTANDO */}
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
      Quantos batimentos contou?
    </label>
    <input 
      type="number" 
      placeholder="Ex: 12" 
      value={batimentos10s}
      onChange={(e) => setBatimentos10s(e.target.value)}
      className="w-full bg-black border border-zinc-800 focus:border-blue-500 text-white rounded p-2 text-xs outline-none transition"
      required
    />
  </div>

  {/* BOTÃO DE CALCULAR */}
  <button type="submit" className="w-full bg-white text-black text-xs font-black py-2.5 rounded uppercase tracking-wider active:scale-95 transition mt-1">
    Calcular Batimentos (BPM)
  </button>

</form>

  {bpmResultado && (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 text-center mt-2 animate-fadeIn">
      <p className="text-xs text-gray-400">Multiplicado por 6, seu resultado é:</p>
      <p className="text-3xl font-black text-white mt-1">{bpmResultado} <span className="text-xs text-blue-500 font-mono">BPM</span></p>
      <p className="text-xs font-bold text-blue-500 uppercase mt-1">{zonaAlvo}</p>
    </div>
  )}
</section>

        {/* 6. DIFERENCIAIS DA ACADEMIA */}
        <section className="text-center space-y-6 py-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">
            DISCIPLINA DE HOJE, <br />
            <span className="text-blue-500">RESULTADO SEMPRE.</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1 p-2">
              <span className="text-blue-500 text-lg block">⭐</span>
              <h5 className="font-bold text-[10px] uppercase tracking-wider">Estrutura Completa</h5>
            </div>
            <div className="space-y-1 p-2">
              <span className="text-blue-500 text-lg block">👥</span>
              <h5 className="font-bold text-[10px] uppercase tracking-wider">Equipe Qualificada</h5>
            </div>
            <div className="space-y-1 p-2">
              <span className="text-blue-500 text-lg block">📈</span>
              <h5 className="font-bold text-[10px] uppercase tracking-wider">Foco em Resultados</h5>
            </div>
            <div className="space-y-1 p-2">
              <span className="text-blue-500 text-lg block">🏆</span>
              <h5 className="font-bold text-[10px] uppercase tracking-wider">Suporte que Motiva</h5>
            </div>
          </div>
        </section>

      </main>

      {/* 7. RODAPÉ */}
      <footer className="bg-zinc-950 border-t border-blue-500/20 py-8 px-6 mt-12 text-center space-y-6">
        <div>
          <h2 className="text-md font-black uppercase tracking-tight text-white">OMEGA GYM</h2>
          <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">Mais que uma academia. Um lugar para você se tornar sua melhor versão.</p>
        </div>
        
        <div className="text-[11px] text-gray-400 space-y-1">
          <p>📍 Rua das Forças, 123 - Limoeiro - PE</p>
          <p>🕒 Seg - Sex: 06h - 22h | Sáb: 08h - 16h | Dom: 09h - 13h</p>
          <p>📞 (81) 9724-0486</p>
        </div>

        <div className="border-t border-zinc-900 pt-4 text-[9px] text-gray-600">
          © {new Date().getFullYear()} OMEGA GYM. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}