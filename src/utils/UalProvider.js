import { Scatter } from "@everipedia/ual-scatter";
import { TokenPocket } from "ual-token-pocket";
import { Anchor } from "ual-anchor";
import { MyKey } from "@everipedia/ual-mykey";
import { appName, ChainId, rpcProtocol, rpcHost, rpcPort } from "../config";

const chain = {
  chainId: ChainId,
  rpcEndpoints: [
    {
      protocol: rpcProtocol,
      host: rpcHost,
      port: rpcPort,
    },
  ],
};

const scatter = new Scatter([chain], { appName });
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
  requestStatus: false,
});

const supportedChains = [chain];
const supportedAuthenticators = [scatter, tokenPocket, anchor, myKey];

export { appName, supportedChains, supportedAuthenticators };
