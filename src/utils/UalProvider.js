import { Scatter } from "@everipedia/ual-scatter";
import { TokenPocket } from "ual-token-pocket";
import { Anchor } from "ual-anchor";
import { MyKey } from "@everipedia/ual-mykey";

import {
  appName,
  ChainId,
  rpcProtocol,
  rpcHost,
  rpcPort,
  isProd
} from "../config";

const chain = {
  chainId: ChainId,
  rpcEndpoints: [
    {
      protocol: rpcProtocol,
      host: rpcHost,
      port: rpcPort
    }
  ]
};

const myKey = new MyKey([chain], { appName });

// use Scatter instead, TP isn't working
const tokenPocketOld = new TokenPocket([chain]);
const tokenPocket = new Scatter([chain], { appName });
if (!tokenPocket.Overriden) {
  tokenPocket.shouldRender = () =>
    tokenPocketOld.supportsAllChains() && tokenPocketOld.isTokenPocketReady();
  tokenPocket.getStyle = () => tokenPocketOld.getStyle();
  tokenPocket.getName = () => tokenPocketOld.getName();
  tokenPocket.Overriden = true;
}

const anchor = new Anchor([chain], {
  appName,
  service: "https://cb.anchor.link",
  disableGreymassFuel: false,
  requestStatus: false
});

const supportedAuthenticators = [tokenPocket, anchor, myKey];
if (isProd) {
  const scatter = new Scatter([chain], { appName });
  supportedAuthenticators.push(scatter);
}
const supportedChains = [chain];

export { appName, supportedChains, supportedAuthenticators };
