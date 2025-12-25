import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Coins, 
  Trophy, 
  RotateCcw, 
  ArrowRight,
  UserPlus,
  Wallet,
  Zap,
  Globe
} from 'lucide-react';
import { GameChart } from './components/GameChart';
import { ASSETS, WELCOME_QUOTES, WIN_BIG_QUOTES, WIN_SMALL_QUOTES, LOSS_QUOTES, TRANSLATIONS } from './constants';
import { GameMode, TradeDirection, GameConfig, UserState, GameResult, GameResultType, Language } from './types';

// --- Types ---
type Screen = 'WELCOME' | 'SETUP_ENT' | 'SETUP_REAL' | 'GAME' | 'RESULT';

// --- Helpers ---
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function App() {
  // --- Global State ---
  const [screen, setScreen] = useState<Screen>('WELCOME');
  const [lang, setLang] = useState<Language>('zh');
  const [userState, setUserState] = useState<UserState>({
    hasWonOnce: false,
    balance: 0,
    isRealModeUnlocked: false,
    usingExperienceGold: false,
  });
  
  // --- Game State ---
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.ENTERTAINMENT);
  const [config, setConfig] = useState<GameConfig>({
    asset: 'BTC/USDT',
    amount: 1000,
    direction: TradeDirection.LONG,
    leverage: 2,
    takeProfitPercent: 20,
    stopLossPercent: 10,
  });
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // --- Modals ---
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // --- Handlers ---
  const t = (key: keyof typeof TRANSLATIONS.zh) => TRANSLATIONS[lang][key];

  const handleStartEntertainment = () => {
    setGameMode(GameMode.ENTERTAINMENT);
    setScreen('SETUP_ENT');
  };

  const handleStartReal = () => {
    setGameMode(GameMode.REAL);
    setScreen('SETUP_REAL');
  };

  const handleGameEnd = (result: GameResult) => {
    setGameResult(result);
    setScreen('RESULT');
    
    // Update user stats
    if (result.type !== GameResultType.LOSS) {
      setUserState(prev => ({ ...prev, hasWonOnce: true }));
    }
    // Balance update simulation (visual only for this demo unless strict accounting needed)
    setUserState(prev => ({
       ...prev, 
       balance: prev.balance + result.pnlAmount
    }));
  };

  const handleClaimExperience = () => {
    setUserState(prev => ({
      ...prev,
      balance: 5,
      isRealModeUnlocked: true,
      usingExperienceGold: true
    }));
    handleStartReal();
  };

  const toggleLang = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans flex justify-center overflow-x-hidden">
      <div className="w-full max-w-md bg-slate-900 min-h-screen relative shadow-2xl border-x border-slate-800">
        
        {/* Header / Nav */}
        <div className="absolute top-0 w-full z-10 p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Coins className="text-yellow-400" size={20} />
            <span className="font-bold text-yellow-400">
              {userState.usingExperienceGold ? t('exp_gold') : t('balance')} 
              ${userState.balance.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {gameMode === GameMode.REAL && <div className="text-xs bg-red-600 px-2 py-1 rounded font-bold">{t('real_mode')}</div>}
            {gameMode === GameMode.ENTERTAINMENT && <div className="text-xs bg-blue-600 px-2 py-1 rounded font-bold">{t('fun_mode')}</div>}
            <button onClick={toggleLang} className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300">
              <Globe size={18} />
            </button>
          </div>
        </div>

        {/* Content Screens */}
        <div className="pt-16 pb-8 px-4 h-full flex flex-col">
          {screen === 'WELCOME' && <WelcomeScreen onStart={handleStartEntertainment} lang={lang} t={t} />}
          {screen === 'SETUP_ENT' && <SetupEntertainment onComplete={(cfg) => { setConfig(cfg); setScreen('GAME'); }} lang={lang} t={t} />}
          {screen === 'SETUP_REAL' && <SetupReal userState={userState} onComplete={(cfg) => { setConfig(cfg); setScreen('GAME'); }} lang={lang} t={t} />}
          {screen === 'GAME' && <GameScreen config={config} mode={gameMode} onEnd={handleGameEnd} lang={lang} t={t} />}
          {screen === 'RESULT' && gameResult && (
            <ResultScreen 
              result={gameResult} 
              mode={gameMode}
              userState={userState}
              onPlayAgain={handleStartEntertainment}
              onClaimExperience={handleClaimExperience}
              onInvite={() => setShowInviteModal(true)}
              onDeposit={() => setShowDepositModal(true)}
              onContinueReal={handleStartReal}
              onSwitchToFun={handleStartEntertainment}
              lang={lang}
              t={t}
            />
          )}
        </div>

        {/* Modals */}
        {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} lang={lang} t={t} />}
        {showDepositModal && <DepositModal onClose={() => setShowDepositModal(false)} onDepositSuccess={(amount) => {
          setUserState(prev => ({ ...prev, balance: prev.balance + amount }));
          setShowDepositModal(false);
        }} lang={lang} t={t} />}

      </div>
    </div>
  );
}

// ---------------- Sub Components ----------------

interface ScreenProps {
  lang: Language;
  t: (key: keyof typeof TRANSLATIONS.zh) => string;
}

// 1. Welcome Screen
const WelcomeScreen = ({ onStart, lang, t }: { onStart: () => void } & ScreenProps) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(getRandomItem(WELCOME_QUOTES[lang]));
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full"></div>
        <h1 className="text-5xl font-black italic tracking-tighter neon-text relative z-10 whitespace-pre-line">
          {t('title')}
        </h1>
      </div>
      
      <p className="text-slate-300 text-lg px-4 italic animate-pulse">
        "{quote}"
      </p>

      <div className="animate-float">
        <img src="https://picsum.photos/200/200?random=1" alt="Crypto Art" className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg object-cover" />
      </div>

      <button 
        onClick={onStart}
        className="w-full max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xl font-bold py-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
      >
        <Play fill="black" /> {t('start_game')}
      </button>
      <p className="text-xs text-slate-500">{t('new_user_tip')}</p>
    </div>
  );
};

// 2. Setup Entertainment (Random Animation)
const SetupEntertainment = ({ onComplete, t }: { onComplete: (cfg: GameConfig) => void } & ScreenProps) => {
  const [status, setStatus] = useState(t('selecting'));
  const [displayConfig, setDisplayConfig] = useState<GameConfig>({
    asset: '???', amount: 0, direction: TradeDirection.LONG, leverage: 1, takeProfitPercent: 0, stopLossPercent: 0
  });

  // Re-run status update when t/lang changes
  useEffect(() => {
     // This effect handles text update if lang swaps mid-animation
     // Not critical for demo but good for polish
  }, [t]);

  useEffect(() => {
    setStatus(t('selecting'));
    let steps = 0;
    const maxSteps = 20; // Animation cycles
    const interval = setInterval(() => {
      steps++;
      
      // Randomize values for visual effect
      setDisplayConfig({
        asset: getRandomItem(ASSETS),
        amount: getRandomInt(100, 10000),
        direction: Math.random() > 0.5 ? TradeDirection.LONG : TradeDirection.SHORT,
        leverage: getRandomInt(1, 3),
        takeProfitPercent: getRandomInt(10, 30),
        stopLossPercent: getRandomInt(5, 20)
      });

      if (steps > maxSteps) {
        clearInterval(interval);
        // Final selection
        const finalConfig: GameConfig = {
          asset: getRandomItem(ASSETS.slice(0, 5)), // Top 5 hot assets
          amount: getRandomInt(100, 10000),
          direction: Math.random() > 0.5 ? TradeDirection.LONG : TradeDirection.SHORT,
          leverage: getRandomInt(1, 3),
          takeProfitPercent: getRandomInt(10, 30),
          stopLossPercent: getRandomInt(5, 20)
        };
        setDisplayConfig(finalConfig);
        setStatus(t('ready'));
        setTimeout(() => onComplete(finalConfig), 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, t]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-8">
      <h2 className="text-2xl font-bold text-yellow-400 animate-pulse">{status}</h2>
      
      <div className="w-full space-y-4">
        <ConfigCard label={t('asset')} value={displayConfig.asset} icon={<Coins size={18}/>} />
        <ConfigCard label={t('amount')} value={`${displayConfig.amount} U`} icon={<Wallet size={18}/>} />
        <ConfigCard 
          label={t('direction')} 
          value={displayConfig.direction === TradeDirection.LONG ? t('long') : t('short')} 
          valueColor={displayConfig.direction === TradeDirection.LONG ? 'text-green-400' : 'text-red-400'}
          icon={displayConfig.direction === TradeDirection.LONG ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} 
        />
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-slate-800 p-3 rounded-lg text-center">
             <div className="text-xs text-slate-400">{t('leverage')}</div>
             <div className="font-bold text-lg">{displayConfig.leverage}x</div>
           </div>
           <div className="bg-slate-800 p-3 rounded-lg text-center">
             <div className="text-xs text-slate-400">{t('tp')}</div>
             <div className="font-bold text-green-400">{displayConfig.takeProfitPercent}%</div>
           </div>
           <div className="bg-slate-800 p-3 rounded-lg text-center">
             <div className="text-xs text-slate-400">{t('sl')}</div>
             <div className="font-bold text-red-400">{displayConfig.stopLossPercent}%</div>
           </div>
        </div>
      </div>
    </div>
  );
};

// 3. Setup Real Mode
const SetupReal = ({ userState, onComplete, t }: { userState: UserState, onComplete: (cfg: GameConfig) => void } & ScreenProps) => {
  const [asset, setAsset] = useState(ASSETS[0]);
  const [amount, setAmount] = useState(Math.min(100, userState.balance));
  const [direction, setDirection] = useState<TradeDirection>(TradeDirection.LONG);
  const [leverage, setLeverage] = useState(5);
  const [tp, setTp] = useState(50);
  const [sl, setSl] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      asset,
      amount,
      direction,
      leverage,
      takeProfitPercent: tp,
      stopLossPercent: sl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6 pt-4">
      <h2 className="text-2xl font-bold text-white">{t('config_real')}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-400">{t('select_asset')}</label>
          <select value={asset} onChange={e => setAsset(e.target.value)} className="w-full bg-slate-800 p-3 rounded text-white border border-slate-700">
            {ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">{t('amount')} ({t('max')}: {userState.balance} U)</label>
          <input 
            type="number" 
            min="1" 
            max={Math.max(1, userState.balance)} 
            value={amount} 
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-slate-800 p-3 rounded text-white border border-slate-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setDirection(TradeDirection.LONG)}
            className={`p-4 rounded font-bold flex items-center justify-center gap-2 border ${direction === TradeDirection.LONG ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            <TrendingUp /> {t('long')}
          </button>
          <button 
            type="button"
            onClick={() => setDirection(TradeDirection.SHORT)}
            className={`p-4 rounded font-bold flex items-center justify-center gap-2 border ${direction === TradeDirection.SHORT ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            <TrendingDown /> {t('short')}
          </button>
        </div>

        <div>
          <label className="text-sm text-slate-400 flex justify-between">
            <span>{t('leverage')} (1-10x)</span>
            <span className="text-yellow-400">{leverage}x</span>
          </label>
          <input type="range" min="1" max="10" value={leverage} onChange={e => setLeverage(Number(e.target.value))} className="w-full accent-yellow-400" />
        </div>

        <div>
          <label className="text-sm text-slate-400 flex justify-between">
            <span>{t('tp')} (1-100%)</span>
            <span className="text-green-400">{tp}%</span>
          </label>
          <input type="range" min="1" max="100" value={tp} onChange={e => setTp(Number(e.target.value))} className="w-full accent-green-400" />
        </div>

        <div>
          <label className="text-sm text-slate-400 flex justify-between">
            <span>{t('sl')} (1-50%)</span>
            <span className="text-red-400">{sl}%</span>
          </label>
          <input type="range" min="1" max="50" value={sl} onChange={e => setSl(Number(e.target.value))} className="w-full accent-red-400" />
        </div>
      </div>

      <button type="submit" className="mt-auto w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-full shadow-lg">
        {t('start_trading')}
      </button>
    </form>
  );
};


// 4. Game Screen
const GameScreen = ({ config, mode, onEnd, t }: { config: GameConfig, mode: GameMode, onEnd: (res: GameResult) => void } & ScreenProps) => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [currentPrice, setCurrentPrice] = useState(10000); // Base mock price
  const [history, setHistory] = useState<{time: number, price: number}[]>([]);
  const [startPrice] = useState(10000);
  const [pnl, setPnl] = useState(0);
  const [pnlPercent, setPnlPercent] = useState(0);
  
  const momentumRef = useRef(0);

  // Targets
  const tpPrice = config.direction === TradeDirection.LONG 
    ? startPrice * (1 + (config.takeProfitPercent / 100) / config.leverage)
    : startPrice * (1 - (config.takeProfitPercent / 100) / config.leverage);
    
  const slPrice = config.direction === TradeDirection.LONG
    ? startPrice * (1 - (config.stopLossPercent / 100) / config.leverage)
    : startPrice * (1 + (config.stopLossPercent / 100) / config.leverage);

  const finalizeGame = useCallback((finalPnl: number, finalPerc: number, forceStop: boolean) => {
    let resultType = GameResultType.LOSS;
    if (finalPnl > 0) {
      resultType = finalPerc > 50 ? GameResultType.WIN_BIG : GameResultType.WIN_SMALL;
    }
    onEnd({
      type: resultType,
      pnlAmount: finalPnl,
      pnlPercent: finalPerc
    });
  }, [onEnd]);

  const handleStop = useCallback(() => {
    finalizeGame(pnl, pnlPercent, true);
  }, [finalizeGame, pnl, pnlPercent]);

  // Game Loop Effects
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    const tickerInterval = setInterval(() => {
      setCurrentPrice(prev => {
        const volatility = 20;
        const force = (Math.random() - 0.5) * 2 * volatility;
        const newMomentum = momentumRef.current * 0.7 + force * 0.3;
        momentumRef.current = newMomentum;
        return prev + newMomentum;
      });
    }, 100);

    return () => {
      clearInterval(clockInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleStop();
    }
  }, [timeLeft, handleStop]);

  useEffect(() => {
    setHistory(prev => {
      return [...prev, { time: Date.now(), price: currentPrice }];
    });
    
    const priceDiffPercent = (currentPrice - startPrice) / startPrice;
    const rawReturn = config.direction === TradeDirection.LONG ? priceDiffPercent : -priceDiffPercent;
    const leveragedReturn = rawReturn * config.leverage;
    
    const currentPnlVal = config.amount * leveragedReturn;
    const currentPnlPerc = leveragedReturn * 100;

    setPnl(currentPnlVal);
    setPnlPercent(currentPnlPerc);

    const isWin = config.direction === TradeDirection.LONG ? currentPrice >= tpPrice : currentPrice <= tpPrice;
    const isLoss = config.direction === TradeDirection.LONG ? currentPrice <= slPrice : currentPrice >= slPrice;

    if (isWin) finalizeGame(currentPnlVal, currentPnlPerc, true);
    if (isLoss) finalizeGame(currentPnlVal, currentPnlPerc, false);

  }, [currentPrice, config, startPrice, tpPrice, slPrice, finalizeGame]);

  const isProfitable = pnl >= 0;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Info */}
      <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
           <Clock size={16} className="text-slate-400" />
           <span className="font-mono text-xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">{config.asset} {config.direction === TradeDirection.LONG ? 'Long' : 'Short'} {config.leverage}x</div>
          <div className="font-mono text-white">${currentPrice.toFixed(2)}</div>
        </div>
      </div>

      {/* Main PnL Display */}
      <div className="flex flex-col items-center justify-center py-6">
         <div className="text-sm text-slate-400 mb-1">{t('current_pnl')}</div>
         <div className={`text-5xl font-black tracking-tight ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
         </div>
         <div className={`text-xl mt-2 font-mono ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}{pnl.toFixed(2)} U
         </div>
      </div>

      {/* Chart */}
      <GameChart 
        data={history} 
        startPrice={startPrice} 
        currentPrice={currentPrice} 
        tpPrice={tpPrice} 
        slPrice={slPrice} 
        isLong={config.direction === TradeDirection.LONG}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-800 p-2 rounded flex justify-between">
          <span className="text-slate-400">{t('principal')}</span>
          <span>{config.amount} U</span>
        </div>
        <div className="bg-slate-800 p-2 rounded flex justify-between">
          <span className="text-slate-400">{t('position')}</span>
          <span>{config.amount * config.leverage} U</span>
        </div>
        <div className="bg-slate-800 p-2 rounded flex justify-between">
          <span className="text-slate-400">{t('tp_price')}</span>
          <span className="text-green-400">{tpPrice.toFixed(2)}</span>
        </div>
        <div className="bg-slate-800 p-2 rounded flex justify-between">
          <span className="text-slate-400">{t('sl_price')}</span>
          <span className="text-red-400">{slPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Stop Button */}
      <button 
        onClick={handleStop}
        className="mt-auto w-full bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2"
      >
        <Zap size={20} fill="white"/> {t('close_position')}
      </button>
    </div>
  );
};


// 5. Result Screen
const ResultScreen = ({ 
  result, 
  mode, 
  userState,
  onPlayAgain, 
  onClaimExperience,
  onInvite,
  onDeposit,
  onContinueReal,
  onSwitchToFun,
  lang,
  t
}: { 
  result: GameResult, 
  mode: GameMode, 
  userState: UserState,
  onPlayAgain: () => void, 
  onClaimExperience: () => void,
  onInvite: () => void,
  onDeposit: () => void,
  onContinueReal: () => void,
  onSwitchToFun: () => void,
} & ScreenProps) => {
  
  const [copy, setCopy] = useState('');

  useEffect(() => {
    let tpl = '';
    const quotes = result.type === GameResultType.LOSS ? LOSS_QUOTES : result.type === GameResultType.WIN_SMALL ? WIN_SMALL_QUOTES : WIN_BIG_QUOTES;
    tpl = getRandomItem(quotes[lang]);
    setCopy(tpl.replace('{x}', result.pnlPercent.toFixed(2)));
  }, [result, lang]);

  const isWin = result.type !== GameResultType.LOSS;
  const title = result.type === GameResultType.LOSS ? t('loss_title') : result.type === GameResultType.WIN_BIG ? t('win_big_title') : t('win_small_title');

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Icon */}
      <div className="relative">
        {isWin && <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>}
        {result.type === GameResultType.WIN_BIG ? (
           <Trophy size={80} className="text-yellow-400 relative z-10" />
        ) : isWin ? (
           <TrendingUp size={80} className="text-green-400 relative z-10" />
        ) : (
           <TrendingDown size={80} className="text-slate-500 relative z-10" />
        )}
      </div>

      {/* Title & PnL */}
      <div>
        <h2 className="text-3xl font-black mb-2">
          {title}
        </h2>
        <div className={`text-4xl font-mono font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
           {isWin ? '+' : ''}{result.pnlAmount.toFixed(2)} U
        </div>
        <div className="text-sm text-slate-400 mt-1">({isWin ? '+' : ''}{result.pnlPercent.toFixed(2)}%)</div>
      </div>

      {/* Copywriting */}
      <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 max-w-xs mx-auto">
        <p className="text-slate-200 italic">"{copy}"</p>
      </div>

      {/* Actions based on Mode */}
      <div className="w-full space-y-3 pt-4">
        
        {/* Scenario 1: Entertainment Mode Ended */}
        {mode === GameMode.ENTERTAINMENT && (
          <>
            <button onClick={onPlayAgain} className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
              <RotateCcw size={18} /> {t('play_again')}
            </button>
            <button onClick={onClaimExperience} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold shadow-lg animate-bounce flex items-center justify-center gap-2">
               <Coins size={18} /> {t('claim_exp')}
            </button>
            <p className="text-xs text-yellow-500">{t('claim_tip')}</p>
          </>
        )}

        {/* Scenario 2: Real Mode */}
        {mode === GameMode.REAL && (
          <>
             {isWin ? (
               // Won in Real Mode
               <>
                 <button onClick={onContinueReal} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <ArrowRight size={18} /> {t('continue_real')}
                 </button>
                 <button onClick={onDeposit} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <Wallet size={18} /> {t('deposit_more')}
                 </button>
               </>
             ) : (
               // Lost in Real Mode
               <>
                 {userState.usingExperienceGold && (
                    <button onClick={onInvite} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                      <UserPlus size={18} /> {t('invite')}
                    </button>
                 )}
                 <button onClick={onDeposit} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <Wallet size={18} /> {t('deposit_recover')}
                 </button>
               </>
             )}
             
             {/* Back to Entertainment Option */}
             <button onClick={onSwitchToFun} className="w-full border border-slate-600 text-slate-400 hover:bg-slate-800 py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-2">
               <RotateCcw size={18} /> {t('back_to_fun')}
             </button>
          </>
        )}
      </div>
    </div>
  );
};

// 6. Helpers Components
const ConfigCard = ({ label, value, valueColor, icon }: any) => (
  <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700">
    <div className="flex items-center gap-3 text-slate-300">
      {icon}
      <span>{label}</span>
    </div>
    <div className={`text-xl font-bold ${valueColor || 'text-white'}`}>{value}</div>
  </div>
);

const InviteModal = ({ onClose, t }: { onClose: () => void } & ScreenProps) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-6 text-center border border-slate-700 shadow-2xl animate-[float_0.3s_ease-out]">
       <h3 className="text-xl font-bold mb-4 text-white">{t('invite_title')}</h3>
       <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TryYourLuckGame" alt="QR" className="mx-auto rounded-lg mb-4 border-4 border-white" />
       <p className="text-slate-300 text-sm mb-6">{t('invite_desc')} <span className="text-yellow-400 font-bold">{t('invite_gold')}</span>！</p>
       <button onClick={onClose} className="w-full bg-slate-700 py-3 rounded-lg text-white">{t('close')}</button>
    </div>
  </div>
);

const DepositModal = ({ onClose, onDepositSuccess, t }: { onClose: () => void, onDepositSuccess: (amount: number) => void } & ScreenProps) => {
  const [val, setVal] = useState('100');
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 w-full max-w-sm rounded-2xl p-6 border border-slate-700 shadow-2xl">
         <h3 className="text-xl font-bold mb-4 text-white">{t('deposit_title')}</h3>
         <div className="mb-4">
           <label className="block text-sm text-slate-400 mb-1">{t('deposit_amount')}</label>
           <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-600 text-white" />
         </div>
         <div className="flex gap-2 mb-6">
           {['100', '500', '1000'].map(v => (
             <button key={v} onClick={() => setVal(v)} className="flex-1 bg-slate-700 py-2 rounded text-sm hover:bg-slate-600">{v}</button>
           ))}
         </div>
         <button onClick={() => onDepositSuccess(Number(val))} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg mb-2">{t('deposit_confirm')}</button>
         <button onClick={onClose} className="w-full text-slate-400 text-sm py-2">{t('cancel')}</button>
      </div>
    </div>
  );
};