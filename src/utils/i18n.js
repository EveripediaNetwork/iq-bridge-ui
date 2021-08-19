import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    translation: {
      // |||||||||||||||||||| SECTIONS ||||||||||||||||||||
      // EOS → pIQ
      swap: "Swap",
      login_info_eos: "Login on EOS Wallet to bridge your tokens",
      // pIQ → IQ
      swap_to_iq_erc20: "Swap to IQ ERC20",
      // ETH → EOS
      your_eos_address: "Your EOS Account",
      eos_account: "EOS account",
      swap_iq_to_eos: "Swap IQ to EOS",
      transactions_broadcasted: "Transactions broadcasted",
      // lock
      lock: "Lock",
      lock_description:
        "The longer you lock your IQ, the more hiIQ you will receive. hiIQ decays slowly over your locking period, eventually reaching 1-to-1 with IQ.",
      withdraw: "Withdraw",
      expired: "Expired",
      expiring_on: "Expiring on",
      login_info_eth_locking: "Login on ETH Wallet to lock your tokens",
      confirming_tx: "Confirming transaction...",
      // ## lockHeader
      updating_balance: "Updating balance...",
      no_hiiq_tokens_locked: "No hiIQ tokens locked so far",
      loading: "Loading",
      disconnected: "Disconnected",
      // ## lockPeriod
      lock_period: "Lock period (weeks)",
      value_restriction: "You can increase the lock time for a maximum of",
      weeks: " weeks",
      // rewards
      earn_iqs: "Lock IQs and earn rewards!",
      earned: "Earned",
      claim: "Claim Rewards",
      required_to_accept: "We will require you to accept the",
      checkpoint: "checkpoint",
      scenarios: "contract interaction in the following scenarios",
      user_is_not_initialized: "The user is not initialized in our system.",
      more_iq_tokens_locked: "More IQ tokens are locked.",
      lock_time_increased: "Lock time is increased.",
      re_calculate: "This operation is used to re-calculate the rewards.",
      waiting_network_confirmation: "Waiting for network confirmation...",
      // voting
      confirmed_tx: "Transaction confirmed!",
      voting: "voting",
      select_a_proposal: "Select a proposal",
      select_proposal_to_see_details: "Select a proposal to see details",
      vote: "Vote",
      voting_ended: "Voting ended",
      no_votes_so_far: "No votes so far",
      // ## votingChart
      loadingVotes: "Loading Votes",
      // ## votingProposalForm
      submit_your_vote_deletion: "Submit your vote deletion",
      // stats
      holders: "Holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      liquidity: "liquidity",
      social: "Social",
      twitter_follower: "Twitter followers",
      // error
      error: "Error",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMMON ||||||||||||||||||||
      your_eth_address: "Your Ethereum Address",
      from: "from",
      tx_executed: "Tx executed",
      login_info_eth: "Login on ETH Wallet to swap your tokens",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMPONENTS ||||||||||||||||||||
      // acountDetailsDialog
      copied_to_clipboard: "Copied to clipboard!",
      copy_address: "Copy Address",
      view_on_block_explorer: "View on Block Explorer",
      last_transactions: "Last transactions",
      transactions_will_appear_here: "Transactions will appear here...",
      // ethereumWalletModal
      select_wallet: "Select a wallet",
      // infoSwapCard
      time_locked: "Time Locked (days)",
      new_hiiq_balance: "New hiIQ",
      // proposalsModal
      details: "Details",
      current_proposals: "Current Proposals",
      // proposalDetails
      close_details: "Close details",
      open_details: "Open details",
      started: "Started",
      at: "At",
      ending: "Ending",
      ended: "Ended",
      select_for_voting: "Select for voting",
      selected: "Selected",
      see_on_snapshot: "Go to proposals",
      // voteBreakdown
      votes_breakdown: "Votes Breakdown",
      // swapContainer
      balance: "balance",
      // txSuccessAlert
      transaction_executed: "Transaction Executed",
      go_to: "Go to",
      step_2: "Step 2",
      // wrongChainModal
      wrong_chain_modal_title: "Wrong Network",
      wrong_chain_modal_body:
        "Please connect to the appropiate Ethereum Network",
      // layout
      logout: "Logout",
      eos_wallet: "EOS Wallet",
      ethereum_wallet: "Ethereum Wallet",
      rewards: "Rewards",
      // languageSeletcor
      language: "Language",
      select_a_language: "Select a Language",
      done: "Done",
      // ---------------------------------------------------------------

      en: "EN",
      ko: "한국어",
      zh: "中文"
    }
  },
  ko: {
    translation: {
      // |||||||||||||||||||| SECTIONS ||||||||||||||||||||
      // EOS → pIQ
      swap: "스왑",
      login_info_eos: "이오스 지갑에 로그인하여 토큰을 브리지합니다.",
      // pIQ → IQ
      swap_to_iq_erc20: "IQ ERC20으로 스왑",
      // ETH → EOS
      your_eos_address: "귀하의 EOS 주소",
      eos_account: "EOS 계정",
      swap_iq_to_eos: "IQ를 EOS로 스왑",
      transactions_broadcasted: "브로드캐스트된 트랜잭션",
      // lock
      lock: "락업",
      lock_description:
        "IQ를 오래 잠글수록 더 많은 hiIQ를 받게됩니다. hiIQ는 잠금 기간 동안 천천히 감소하여 결국 IQ와 1 : 1에 도달합니다.",
      withdraw: "Withdraw",
      expired: "Expired",
      expiring_on: "Expiring on",
      login_info_eth_locking: "토큰을 잠 그려면 ETH 지갑에 로그인하세요.",
      confirming_tx: "거래 확인 중 ...",
      // ## lockHeader
      updating_balance: "잔액 업데이트 중 ...",
      no_hiiq_tokens_locked: "지금까지 잠긴 hiIQ 토큰이 없습니다.",
      loading: "로딩 중",
      disconnected: "연결 끊김",
      // ## lockPeriod
      lock_period: "Lock period (weeks)",
      value_restriction: "You can increase the lock time for a maximum of",
      weeks: " weeks",
      // rewards
      earn_iqs: "Lock IQs and earn rewards!",
      earned: "Earned",
      claim: "Claim Rewards",
      required_to_accept: "We will require you to accept the",
      checkpoint: "checkpoint",
      scenarios: "contract interaction in the following scenarios",
      user_is_not_initialized: "The user is not initialized in our system.",
      more_iq_tokens_locked: "More IQ tokens are locked.",
      lock_time_increased: "Lock time is increased.",
      re_calculate: "This operation is used to re-calculate the rewards.",
      waiting_network_confirmation: "Waiting for network confirmation...",
      // voting
      confirmed_tx: "거래가 확인되었습니다!",
      voting: "투표",
      select_a_proposal: "제안 선택",
      select_proposal_to_see_details: "세부 정보를 보려면 제안을 선택하세요.",
      vote: "투표",
      voting_ended: "투표 종료",
      no_votes_so_far: "지금까지 투표가 없습니다.",
      // ## votingChart
      loadingVotes: "투표 로딩중",
      // ## votingProposalForm
      // stats
      holders: "Holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      liquidity: "liquidity",
      social: "Social",
      twitter_follower: "Twitter followers",
      // error
      error: "오류",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMMON ||||||||||||||||||||
      your_eth_address: "귀하의 이더 리움 주소",
      from: "부터",
      tx_executed: "트랜잭션 실행",
      login_info_eth: "ETH 지갑에 로그인하여 토큰 교환",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMPONENTS ||||||||||||||||||||
      // acountDetailsDialog
      copied_to_clipboard: "Copied to clipboard!",
      copy_address: "Copy Address",
      view_on_block_explorer: "View on Block Explorer",
      last_transactions: "Last transactions",
      transactions_will_appear_here: "Transactions will appear here...",
      // ethereumWalletModal
      select_wallet: "지갑 선택",
      // infoSwapCard
      time_locked: "잠긴 시간 (일)",
      new_hiiq_balance: "새로운 hiIQ",
      // proposalsModal
      details: "세부 정보",
      current_proposals: "현재 제안",
      // proposalDetails
      close_details: "세부 정보 닫기",
      open_details: "세부 정보 열기",
      started: "투표 시작 날짜",
      at: "시간",
      ending: "투표 마감 날짜",
      ended: "투표 마감",
      select_for_voting: "투표를 위해 선택",
      selected: "선택 완료",
      see_on_snapshot: "제안 보기",
      // voteBreakdown
      votes_breakdown: "투표 내역",
      // swapContainer
      balance: "밸런스",
      // txSuccessAlert
      transaction_executed: "거래 실행",
      go_to: "이동",
      step_2: "2 단계",
      // wrongChainModal
      wrong_chain_modal_title: "잘못된 네트워크",
      wrong_chain_modal_body: "적절한 이더 리움 네트워크에 연결하십시오",
      // layout
      logout: "로그 아웃",
      eos_wallet: "EOS 지갑",
      ethereum_wallet: "이더 리움 지갑",
      rewards: "Rewards",
      // languageSelector
      language: "언어",
      select_a_language: "언어 선택",
      done: "끝난",
      // ---------------------------------------------------------------

      en: "EN",
      ko: "한국어",
      zh: "中文"
    }
  },

  zh: {
    translation: {
      // |||||||||||||||||||| SECTIONS ||||||||||||||||||||
      // EOS → pIQ
      swap: "交换",
      login_info_eos: "登录 EOS 钱包以桥接您的代币",
      // pIQ → IQ
      swap_to_iq_erc20: "交易IQ至ERC20",
      // ETH → EOS
      your_eos_address: "您的 EOS 账户",
      eos_account: "EOS账户",
      swap_iq_to_eos: "交易IQ至EOS",
      transactions_broadcasted: "交易已广播",
      // lock
      lock: "锁",
      lock_description:
        "锁定 IQ 的时间越长，您获得的 hiIQ 就越多。hiIQ 在锁定期间缓慢衰减，最终与 IQ 达到 1 比 1。",
      withdraw: "Withdraw",
      expired: "Expired",
      expiring_on: "Expiring on",
      login_info_eth_locking: "登录 ETH 钱包以锁定您的代币",
      confirming_tx: "正在确认交易...",
      // ## lockHeader
      updating_balance: "正在更新余额...",
      no_hiiq_tokens_locked: "到目前为止还没有锁定 hiIQ 代币",
      loading: "加载中",
      disconnected: "Disconnected",
      // ## lockPeriod
      lock_period: "Lock period (weeks)",
      value_restriction: "You can increase the lock time for a maximum of",
      weeks: " weeks",
      // rewards
      earn_iqs: "Lock IQs and earn rewards!",
      earned: "Earned",
      claim: "Claim Rewards",
      required_to_accept: "We will require you to accept the",
      checkpoint: "checkpoint",
      scenarios: "contract interaction in the following scenarios",
      user_is_not_initialized: "The user is not initialized in our system.",
      more_iq_tokens_locked: "More IQ tokens are locked.",
      lock_time_increased: "Lock time is increased.",
      re_calculate: "This operation is used to re-calculate the rewards.",
      waiting_network_confirmation: "Waiting for network confirmation...",
      // voting
      confirmed_tx: "交易确认！",
      voting: "投票",
      select_a_proposal: "选择一个提案",
      select_proposal_to_see_details: "选择一个提案以了解详情",
      vote: "投票",
      voting_ended: "投票结束",
      no_votes_so_far: "暂无投票",
      // ## votingChart
      loadingVotes: "加载投票",
      // ## votingProposalForm
      // stats
      holders: "Holders",
      volume: "volume",
      total: "total",
      apps: "apps",
      prediqt_markets: "PredIQt markets",
      everipedia_articles: "Everipedia articles",
      everipedia_onchain_edits: "Everipedia Onchain Edits",
      everipedia_page_views: "Everipedia Page Views",
      liquidity: "liquidity",
      social: "Social",
      twitter_follower: "Twitter followers",
      // error
      error: "错误",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMMON ||||||||||||||||||||
      your_eth_address: "你的以太坊地址",
      from: "从",
      tx_executed: "Tx 已执行",
      login_info_eth: "Login on ETH Wallet to swap your tokens",
      // ---------------------------------------------------------------

      // |||||||||||||||||||| COMPONENTS ||||||||||||||||||||
      // acountDetailsDialog
      copied_to_clipboard: "Copied to clipboard!",
      copy_address: "Copy Address",
      view_on_block_explorer: "View on Block Explorer",
      last_transactions: "Last transactions",
      transactions_will_appear_here: "Transactions will appear here...",
      // ethereumWalletModal
      select_wallet: "选择钱包",
      // infoSwapCard
      time_locked: "锁定时间（天）",
      new_hiiq_balance: "新高智商",
      // proposalsModal
      details: "详情",
      current_proposals: "当前提案",
      // proposalDetails
      close_details: "关闭详情",
      open_details: "打开详情",
      started: "开始",
      at: "时间",
      ending: "结束中",
      ended: "已结束",
      select_for_voting: "选择投票",
      selected: "已选",
      see_on_snapshot: "前往提案",
      // voteBreakdown
      votes_breakdown: "投票明细",
      // swapContainer
      balance: "余额",
      // txSuccessAlert
      transaction_executed: "交易执行",
      go_to: "去",
      step_2: "第2步",
      // wrongChainModal
      wrong_chain_modal_title: "错误的网络",
      wrong_chain_modal_body: "请连接到合适的以太坊网络",
      // layout
      logout: "登出",
      eos_wallet: "EOS钱包",
      ethereum_wallet: "以太坊钱包",
      rewards: "Rewards",
      // languageSelector
      language: "语",
      select_a_language: "选择语言",
      done: "完毕",
      // ---------------------------------------------------------------

      en: "EN",
      ko: "한국어",
      zh: "中文"
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
