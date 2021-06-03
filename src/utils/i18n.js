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
      select_token: "Select a token",
      price: "Price",
      price_impact: "Price impact",
      liquidity_fee: "Liquidity provider fee",
      min_received: "Minimum received",
      max_profit: "Maximum profit",
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
      error: "Error"
    }
  },
  ko: {
    translation: {
      // layout
      eos_wallet: "EOS 지갑",
      ethereum_wallet: "이더 리움 지갑",
      swap: "교환",
      lock: "자물쇠",
      pool: "풀",
      convert: "전환",
      logout: "로그아웃",
      connect_wallet: "지갑 연결",
      // pool
      // convert
      tokens: "토큰",
      liquidity: "유동성",
      shares: "지불",
      max_tokens: "이용가능한 토큰",
      amount_tokens_convert: "전환할 토큰",
      market: "시장",
      max_shares: "이용가능한 지분",
      amount_shares_convert: "전환할 지분",
      // lock page
      balance: "잔액",
      from: "보내는이",
      to: "받는이",
      your_eth_address: "귀하의 이더 리움 주소",
      select_token: "토큰",
      price: "가격",
      price_impact: "가격 변화",
      liquidity_fee: "유동성 공급 수수료",
      min_received: "최소 수령액",
      max_profit: "최대 수익",
      lock_period: "잠금 기간 (일)",
      current_hiiq_balance: "현재 hiIQ",
      new_hiiq_balance: "새로운 hiIQ",
      lock_description:
        "IQ를 오래 잠글수록 더 많은 hiIQ를 받게됩니다. 더 많은 IQ를 잠 그거나 잠금 기간을 연장하여 추가 hiIQ를 얻을 수도 있습니다. hiIQ는 잠금 기간 동안 천천히 감소하여 결국 IQ와 1 : 1에 도달합니다.",
      locked: "잠김",
      value_restriction: "입력 값은 1에서 1460 사이 여야합니다.",
      login_info_eos: "로그인해서 스왑하기",
      login_info_eth: "Login on ETH Wallet to swap your tokens",
      login_info_eth_locking: "Login on ETH Wallet to lock your tokens",
      time_locked: "잠긴 시간 (일)",
      lock_time: "잠긴 시간",
      updating_balance: "잔액 업데이트...",
      no_hiiq_tokens_locked: "지금까지 잠긴 hiIQ 토큰이 없습니다.",
      loading: "로딩 중",
      disconnected: "연결 끊김",
      // dialog tx
      confirming_tx: "트랜잭션 진행중...",
      confirmed_tx: "트랜잭션 완료!",
      something_wrong: "문제가 발생했습니다",
      current_supply: "현재 공급량’",
      pool_shares: "받을 풀 지분",
      pool_shares_pct: "풀 비율",
      tokens_add_liquidity: "유동성을 증가시키는 토큰",
      add_liquidity: "유동성 풀 공급",
      remove_liquidity: "유동성 제거",
      amount_of_liquidity_to_remove: "Amount of liquidity to remove",
      transactions: "업무",
      txAlert: "네트워크 속도에 따라 거래 세부 정보가 제공됩니다.",
      // settings
      settings: "설정",
      transaction_settings: "거래 설정",
      slippage_tolerance: "슬리피지 설정",
      settings_statement:
        "*거래 실행시 가격 변동이 금액 범위를 초가하면 거래가 최소됩니다",
      confirm: "확인",
      // language
      language: "언어",
      select_a_language: "언어선택",
      done: "완료",
      en: "EN",
      ko: "한국어",
      zh: "中文",
      // other
      select_wallet: "지갑 선택",
      transaction_executed: "거래 실행",
      go_to: "이동",
      step: "2 단계",
      error: "오류"
    }
  },

  zh: {
    translation: {
      // layout
      eos_wallet: "EOS钱包",
      ethereum_wallet: "以太坊钱包",
      swap: "交换",
      lock: "锁",
      pool: "池子",
      convert: "转换",
      logout: "登出",
      connect_wallet: "链接钱包",
      // pool
      // convert
      tokens: "代币",
      liquidity: "流动性",
      shares: "股份",
      max_tokens: "最大可用代币",
      amount_tokens_convert: "要转换的代币数量",
      market: "市场",
      max_shares: "最大可用的股份",
      amount_shares_convert: "要转换的股份数量",
      // lock page
      balance: "余额",
      from: "从",
      to: "到",
      your_eth_address: "您的以太坊地址",
      select_token: "选择一种代币",
      price: "价格",
      price_impact: "价格影响",
      liquidity_fee: "流动性提供者费用",
      min_received: "最低可获得",
      current_hiiq_balance: "当前的hiIQ",
      new_hiiq_balance: "新的hiIQ",
      max_profit: "最大收益",
      lock_period: "锁定期（天）",
      lock_description:
        "锁定IQ的时间越长，收到的hiIQ越多。您还可以通过锁定更多IQ或延长锁定时间来获得其他hiIQ。在锁定期间，hiIQ会缓慢衰减，最终与IQ达到1比1。",
      locked: "已锁定",
      value_restriction: "输入值必须在1到1460之间",
      login_info_eos: "로그인해서 스왑하기",
      login_info_eth: "Login on ETH Wallet to swap your tokens",
      login_info_eth_locking: "Login on ETH Wallet to lock your tokens",
      time_locked: "时间锁定(天)",
      updating_balance: "更新余额...",
      no_hiiq_tokens_locked: "到目前为止，尚未锁定任何hiIQ令牌",
      loading: "载入中",
      disconnected: "断线",
      // dialog tx
      confirming_tx: "确认交易...",
      confirmed_tx: "交易已确认!",
      something_wrong: "发生错误",
      current_supply: "当前供应",
      pool_shares: "池子中待领取股份",
      pool_shares_pct: "做市占比",
      tokens_add_liquidity: "增加流动性的代币",
      add_liquidity: "加入流动性",
      remove_liquidity: "移除流动性",
      amount_of_liquidity_to_remove: "Amount of liquidity to remove",
      transactions: "交易",
      txAlert: "交易详情将取决于网络的速度",
      // settings
      settings: "设置",
      transaction_settings: "交易设置",
      slippage_tolerance: "滑点设置",
      settings_statement:
        "*如果执行交易时价格变化超过滑点保护范围，交易将被撤销.",
      confirm: "确认",
      // language
      language: "语言",
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
      error: "错误"
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
