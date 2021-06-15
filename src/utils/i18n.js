import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    translation: {
      // layout
      eos_wallet: "EOS Wallet",
      ethereum_wallet: "Ethereum Wallet",
      swap: "Swap",
      lock: "Lock",
      pool: "pool",
      convert: "convert",
      logout: "logout",
      connect_wallet: "connect to a wallet",
      // pool page
      // convert page
      tokens: "tokens",
      liquidity: "liquidity",
      shares: "shares",
      max_tokens: "Max tokens available",
      amount_tokens_convert: "Amount of tokens to convert",
      market: "market",
      max_shares: "Max shares available",
      amount_shares_convert: "Amount of shares to convert",
      // swap page
      balance: "balance",
      from: "from",
      to: "to",
      your_eth_address: "Your Ethereum Address",
      your_eos_address: "Your EOS Account",
      select_token: "Select a token",
      price: "Price",
      price_impact: "Price impact",
      liquidity_fee: "Liquidity provider fee",
      min_received: "Minimum received",
      max_profit: "Maximum profit",
      // stats
      stats: "Stats",
      holders: "holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      social: "Social",
      // Lock page
      value_restriction: "Input value must be between 1 and 1460",
      lock_period: "Lock period (days)",
      lock_description:
        "The longer you lock your IQ, the more hiIQ you will receive. You can also get additional hiIQ by locking more IQ or extending the lock period. hiIQ decays slowly over your locking period, eventually reaching 1-to-1 with IQ.",
      locked: "locked",
      login_info_eos: "Login on EOS Wallet to bridge your tokens",
      login_info_eth: "Login on ETH Wallet to swap your tokens",
      login_info_eth_locking: "Login on ETH Wallet to lock your tokens",
      time_locked: "Time Locked (days)",
      current_hiiq_balance: "Current hiIQ",
      new_hiiq_balance: "New hiIQ",
      updating_balance: "Updating balance...",
      no_hiiq_tokens_locked: "No hiIQ tokens locked so far",
      loading: "Loading",
      disconnected: "Disconnected",
      // dialog tx
      confirming_tx: "Confirming transaction...",
      confirmed_tx: "Transaction confirmed!",
      something_wrong: "Something went wrong.",
      current_supply: "Current Supply",
      pool_shares: "Pool shares to receive",
      pool_shares_pct: "Percentage of pool",
      tokens_add_liquidity: "Tokens to add liquidity",
      add_liquidity: "add liquidity",
      remove_liquidity: "remove liquidity",
      amount_of_liquidity_to_remove: "Amount of liquidity to remove",
      transactions: "Transactions",
      txAlert:
        "Transaction details will be available depeding on how fast the network is",
      // settings
      settings: "Settings",
      transaction_settings: "Transaction Settings",
      slippage_tolerance: "Slippage Tolerance",
      settings_statement:
        "*If the price moves by more than this amount on execution, the transaction will stop.",
      confirm: "Confirm",
      // language
      language: "Language",
      select_a_language: "Select a Language",
      done: "Done",
      en: "EN",
      ko: "한국어",
      zh: "中文",
      // other
      select_wallet: "Select a wallet",
      transaction_executed: "Transaction Executed",
      go_to: "Go to",
      step: "Step 2",
      error: "Error",
      wrong_chain_modal_title: "Wrong Network",
      wrong_chain_modal_body:
        "Please connect to the appropiate Ethereum Network"
    }
  },
  ko: {
    translation: {
      // layout
      eos_wallet: "이오스 지갑",
      ethereum_wallet: "이더리움 지갑",
      swap: "스왑",
      lock: "락업",
      pool: "풀",
      convert: "전환",
      logout: "로그아웃",
      connect_wallet: "지갑에 연결",
      // pool page
      // convert page
      tokens: "토큰",
      liquidity: "유동성",
      shares: "셰어",
      max_tokens: "최대 토큰 잔액",
      amount_tokens_convert: "전환할 토큰 잔액",
      market: "시장",
      max_shares: "최대 셰어 개수",
      amount_shares_convert: "전환할 셰어 개수",
      // swap page
      balance: "잔액",
      from: "보내는이",
      to: "받는이",
      your_eth_address: "이더리움 주소",
      your_eos_address: "Your EOS Account",
      select_token: "토큰 선택",
      price: "가격",
      price_impact: "가격 영향",
      liquidity_fee: "유동성 제공자 수수료",
      min_received: "최소 수령액",
      max_profit: "최대 수익",
      // stats
      stats: "Stats",
      holders: "holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      social: "Social",
      // lock page
      value_restriction: "입력 값은 1에서 1460 사이여야 합니다.",
      lock_period: "락업 기간(일)",
      lock_description:
        "IQ를 오래 잠글수록 더 많은 hiIQ를 받게 됩니다. 더 많은 IQ를 잠그거나 잠금 기간을 연장하여 추가 hiIQ를 얻을 수도 있습니다. hiIQ는 잠금 기간 동안 서서히 감소하여 결국 IQ랑 1:1에 도달합니다.",
      locked: "락업된 개수",
      login_info_eos: "이오스 지갑에 로그인하여 토큰을 브리지합니다.",
      login_info_eth: "이더리움 지갑에 로그인하여 토큰을 스왑하십시오.",
      login_info_eth_locking: "이더리움 지갑에 로그인하여 토큰을 락업하십시오.",
      time_locked: "락업 기간(일)",
      current_hiiq_balance: "현재 hiIQ 잔액",
      new_hiiq_balance: "새로운 hiIQ 잔액",
      updating_balance: "잔액 업데이트중...",
      no_hiiq_tokens_locked: "지금까지 락업된 hiIQ 토큰이 없습니다.",
      Loading: "Loading",
      disconnected: "연결 끊김",
      // dialog tx
      confirming_tx: "거래 확인 중...",
      confirmed_tx: "거래확정!",
      something_wrong: "문제가 발생했습니다.",
      current_supply: "현재 공급량",
      pool_shares: "받을 풀 셰어",
      pool_shares_pct: "풀의 퍼센티지",
      tokens_add_liquidity: "유동성을 추가할 토큰",
      add_liquidity: "유동성 추가",
      remove_liquidity: "유동성 제거",
      transactions: "업무",
      txAlert: "네트워크 속도에 따라 거래 세부 정보가 제공됩니다.",
      amount_of_liquidity_to_remove: "제거할 유동성 개수",
      // settings
      settings: "설정",
      transaction_settings: "거래 설정",
      slippage_tolerance: "최대 하락",
      settings_statement:
        "*실행 후 가격이 해당 양보다 많이 변동하면 거래가 중지됩니다.",
      confirm: "확인",
      // language
      language: "언어",
      select_a_language: "언어 선택",
      done: "완료",
      en: "EN",
      ko: "한국어",
      zh: "中文",
      // other
      select_wallet: "지갑 선택",
      transaction_executed: "거래 실행 완료",
      go_to: "이동",
      step: "2 단계",
      error: "오류",
      wrong_chain_modal_title: "잘못된 네트워크",
      wrong_chain_modal_body: "적절한 이더 리움 네트워크에 연결하십시오"
    }
  },

  zh: {
    translation: {
      // layout
      eos_wallet: "EOS 钱包",
      ethereum_wallet: "以太坊钱包",
      swap: "兑换",
      lock: "锁定",
      pool: "池子",
      convert: "转换",
      logout: "登出",
      connect_wallet: "链接钱包",
      // pool page
      // convert page
      tokens: "代币",
      liquidity: "流动性",
      shares: "股份",
      max_tokens: "最大可用代币",
      amount_tokens_convert: "要转换代币的数量",
      market: "市场",
      max_shares: "最大可用股份",
      amount_shares_convert: "要转换的股份数量",
      // swap page
      balance: "余额",
      from: "从",
      to: "到",
      your_eth_address: "您的以太坊地址",
      your_eos_address: "Your EOS Account",
      select_token: "选择一个代币",
      price: "价格",
      price_impact: "价格影响",
      liquidity_fee: "流动性提供者手续费",
      min_received: "至少获取",
      max_profit: "最大利润",
      // stats
      stats: "Stats",
      holders: "holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      social: "Social",
      // Lock page
      value_restriction: "输入值必须介于1到1460",
      lock_period: "锁定时长 (days)",
      lock_description:
        "您锁定您的IQ时间越长，您得到的IQ就越多。您也可以通过锁定更多的IQ或延长锁定时间来获得额外的hiIQ。hiIQ会随着您的锁定期慢慢衰减，最终与IQ达到1：1。",
      locked: "已锁定",
      login_info_eos: "登录EOS钱包桥接您的代币",
      login_info_eth: "登录您的ETH钱包兑换您的代币",
      login_info_eth_locking: "登录ETH钱包锁定您的代币",
      time_locked: "锁定时长(days)",
      current_hiiq_balance: "现有 hiIQ",
      new_hiiq_balance: "新的 hiIQ",
      updating_balance: "更新余额...",
      no_hiiq_tokens_locked: "暂时没有 hiIQ代币被锁定",
      loading: "加载中",
      disconnected: "断开连接",
      // dialog tx
      confirming_tx: "确认交易...",
      confirmed_tx: "交易已确认!",
      something_wrong: "出错了.",
      current_supply: "目前供应",
      pool_shares: "可领取的池子份额",
      pool_shares_pct: "池子占比",
      tokens_add_liquidity: "添加流动性代币",
      add_liquidity: "添加流动性",
      remove_liquidity: "移除流动性",
      transactions: "交易",
      txAlert: "交易详情将取决于网络的速度",
      amount_of_liquidity_to_remove: "移除流动性数量",
      // settings
      settings: "设置",
      transaction_settings: "交易设置",
      slippage_tolerance: "最大滑点",
      settings_statement: "*如果执行时价格变化超过设定的量，交易将停止",
      confirm: "确认",
      // language
      language: "语言e",
      select_a_language: "选择一种语言",
      done: "完成",
      en: "EN",
      ko: "한국어",
      zh: "中文",
      // other
      select_wallet: "选择一个钱包",
      transaction_executed: "Transaction Executed",
      go_to: "去",
      step_2: "第2步",
      error: "错误",
      wrong_chain_modal_title: "错误的网络",
      wrong_chain_modal_body: "请连接到合适的以太坊网络"
    }
  }
};

const languageDetector = new LanguageDetector(null, {
  order: ["querystring", "localStorage", "navigator"],
  lookupLocalStorage: "storeLang",
  caches: ["localStorage"]
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    supportedLngs: ["en", "ko", "zh"]
  });

export default i18n;
