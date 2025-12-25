import { Language } from "./types";

export const ASSETS = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'DOGE/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'ZEC/USDT'
];

export const WELCOME_QUOTES = {
  zh: [
    "搏一搏，单车变摩托！",
    "今日财运如何？全看这一把！",
    "相信你的直觉，财富就在指尖。",
    "不仅是游戏，更是对人性的考验。",
    "狭路相逢勇者胜，试试你的手气！"
  ],
  en: [
    "Risk it all, win it big!",
    "How is your luck today? It all depends on this move!",
    "Trust your instincts, wealth is at your fingertips.",
    "It's not just a game, it's a test of character.",
    "Fortune favors the bold, try your luck!"
  ]
};

export const LOSS_QUOTES = {
  zh: [
    "您本次投资产生了亏损，胜败乃兵家常事，多练习盘感，下次说不定就能大赚。",
    "市场无情，人有情。休息片刻，调整心态再战！",
    "这次只是运气不好，下次一定翻盘！",
    "不要气馁，大神的每一步都是从亏损中走出来的。"
  ],
  en: [
    "You took a loss this time. Defeat is common in battle; practice more, and you might win big next time.",
    "The market is ruthless, but you are strong. Take a break, reset your mindset, and fight again!",
    "Just bad luck this time, you'll turn it around next time!",
    "Don't be discouraged, every master started with losses."
  ]
};

export const WIN_SMALL_QUOTES = {
  zh: [
    "恭喜，本次游戏盈利{x}%，赢多输少，则能财源滚滚。",
    "稳扎稳打，步步为营，这才是长久之道。",
    "运气不错！看来今天适合搞点大的。",
    "小试牛刀就赚了，您的盘感很准哦！"
  ],
  en: [
    "Congratulations, you profited {x}%! Winning more than losing is the path to wealth.",
    "Steady and sure, step by step, that is the long-term way.",
    "Nice luck! Looks like today is a good day to go big.",
    "Small test, big result. Your instincts are sharp!"
  ]
};

export const WIN_BIG_QUOTES = {
  zh: [
    "恭喜您，本次大赚{x}%，获得【投机之王】称号！",
    "简直是神之一手！华尔街之狼非你莫属！",
    "全场欢呼！您的操作简直如入无人之境！",
    "财富自由的号角已经吹响，太强了！"
  ],
  en: [
    "Congratulations, you made a massive {x}% profit! You are the King of Speculation!",
    "Godlike move! You are the Wolf of Wall Street!",
    "The crowd goes wild! Your trading is unstoppable!",
    "The horn of financial freedom has sounded, you are too strong!"
  ]
};

export const TRANSLATIONS = {
  zh: {
    title: "试试\n手气",
    real_mode: "实盘模式",
    fun_mode: "娱乐模式",
    exp_gold: "体验金: ",
    balance: "余额: ",
    start_game: "立即开始",
    new_user_tip: "新人免费试玩，赢了开启实盘",
    selecting: "随机选择中...",
    ready: "选定离手！",
    asset: "合约资产",
    amount: "下注金额",
    direction: "方向",
    leverage: "倍数",
    tp: "止盈",
    sl: "止损",
    long: "看涨 (Long)",
    short: "看跌 (Short)",
    max: "最大",
    start_trading: "开始交易",
    current_pnl: "当前收益",
    principal: "本金",
    position: "持仓",
    tp_price: "止盈价",
    sl_price: "止损价",
    close_position: "立即平仓 (Stop)",
    loss_title: "遗憾离场",
    win_small_title: "恭喜小赚",
    win_big_title: "投机之王",
    play_again: "再玩一次",
    claim_exp: "领取5U体验金",
    claim_tip: "限时领取，赚的钱你可以拿走！",
    continue_real: "继续玩 (再赚更多)",
    deposit_more: "去充值 (加大投入)",
    deposit_recover: "去充值 (翻本)",
    invite: "邀请好友 (再领5U)",
    back_to_fun: "返回娱乐模式",
    invite_title: "呼朋唤友一起赚",
    invite_desc: "邀请好友注册，您将再次获得",
    invite_gold: "5U 体验金",
    close: "关闭",
    deposit_title: "充值中心",
    deposit_amount: "金额 (USDT)",
    deposit_confirm: "立即充值",
    cancel: "取消",
    config_real: "实盘配置",
    select_asset: "选择合约"
  },
  en: {
    title: "Try Your\nLuck",
    real_mode: "REAL MODE",
    fun_mode: "FUN MODE",
    exp_gold: "Exp Gold: ",
    balance: "Balance: ",
    start_game: "Start Game",
    new_user_tip: "Free to play, win to unlock Real Mode",
    selecting: "Selecting...",
    ready: "Ready!",
    asset: "Asset",
    amount: "Amount",
    direction: "Direction",
    leverage: "Lev",
    tp: "Take Profit",
    sl: "Stop Loss",
    long: "Long",
    short: "Short",
    max: "Max",
    start_trading: "Start Trading",
    current_pnl: "Current PnL",
    principal: "Margin",
    position: "Size",
    tp_price: "TP Price",
    sl_price: "SL Price",
    close_position: "Close Position",
    loss_title: "Game Over",
    win_small_title: "Nice Win",
    win_big_title: "Jackpot!",
    play_again: "Play Again",
    claim_exp: "Claim 5U Gold",
    claim_tip: "Limited time offer, keep what you earn!",
    continue_real: "Continue (Earn More)",
    deposit_more: "Deposit (Boost)",
    deposit_recover: "Deposit (Recover)",
    invite: "Invite (Get 5U)",
    back_to_fun: "Back to Fun Mode",
    invite_title: "Invite & Earn",
    invite_desc: "Invite friends to register and get another",
    invite_gold: "5U Exp Gold",
    close: "Close",
    deposit_title: "Deposit Center",
    deposit_amount: "Amount (USDT)",
    deposit_confirm: "Deposit Now",
    cancel: "Cancel",
    config_real: "Configuration",
    select_asset: "Select Asset"
  }
};