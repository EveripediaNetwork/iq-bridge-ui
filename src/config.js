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
  maticExplorerUrl: process.env.REACT_APP_MATIC_EXPLORER_URL
};
