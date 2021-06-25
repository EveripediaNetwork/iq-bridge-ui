module.exports = {
  env: process.env.NODE_ENV,
  publicURL: process.env.PUBLIC_URL,
  appName: process.env.REACT_APP_APP_NAME,
  ChainId: process.env.REACT_APP_CHAIN_ID,
  rpcProtocol: process.env.REACT_APP_RPC_PROTOCOL,
  rpcHost: process.env.REACT_APP_RPC_HOST,
  rpcPort: process.env.REACT_APP_RPC_PORT,
  everipediaIqContract: process.env.REACT_APP_EVERIPEDIAIQ_CONTRACT,
  isProd: process.env.REACT_APP_IS_PROD,
  ethChainId: Number(process.env.REACT_APP_ETH_CHAIN_ID),
  ethBasedExplorerUrl: process.env.REACT_APP_ETH_EXPLORER_URL,
  iqAddress: process.env.REACT_APP_IQ_ADDRESS,
  hiIQAddress: process.env.REACT_APP_HIIQ_ADDRESS,
  pIQAddress: process.env.REACT_APP_PIQ_ADDRESS,
  pMinterAddress: process.env.REACT_APP_PMINTER_ADDRESS,
  fortmaticApiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  walletConnectRpcUrl: process.env.REACT_APP_WALLET_CONNECT_RPC_URL,
  walletLinkUrl: process.env.REACT_APP_WALLET_LINK_URL,
  portisId: process.env.REACT_APP_PORTIS_ID,
  snapshotSpaceUrl:
    process.env.REACT_APP_SNAPSHOT_SPACE_URL ||
    "https://snapshot.org/#/everipediaiq.eth/proposal/",
  snapshotBaseEndpoint:
    process.env.REACT_APP_SNAPSHOT_BASE_ENDPOINT ||
    "https://hub.snapshot.page/graphql"
};
