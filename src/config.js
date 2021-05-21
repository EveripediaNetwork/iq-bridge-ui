module.exports = {
  env: process.env.NODE_ENV,
  publicURL: process.env.PUBLIC_URL,
  appName: process.env.REACT_APP_APP_NAME,
  ChainId: process.env.REACT_APP_CHAIN_ID,
  rpcProtocol: process.env.REACT_APP_RPC_PROTOCOL,
  rpcHost: process.env.REACT_APP_RPC_HOST,
  rpcPort: process.env.REACT_APP_RPC_PORT,
  prediqTokensContract: process.env.REACT_APP_PREDIQTOKENS_CONTRACT,
  everipediaIqContract: process.env.REACT_APP_EVERIPEDIAIQ_CONTRACT,
  isProd: process.env.REACT_APP_IS_PROD
};
