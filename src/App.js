import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";

import Error from "./features/error";
import Loading from "./features/loading";
import ErrorBoundary from "./components/errorBoundary";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import {
  UALProviderSwitch,
  WalletProvider
} from "./context/walletProvider/walletProviderFacade";
import { ChainIdContext } from "./context/chainIdProvider/chainIdContext";
import { ethChainId } from "./config";

const HomePage = lazy(() => import("./features/home"));
const EthPage = lazy(() => import("./features/eth"));
const ReverseEthPage = lazy(() => import("./features/reverseEth"));
const LockPage = lazy(() => import("./features/Lock/lock"));
const VotingPage = lazy(() => import("./features/Voting/voting"));

function App() {
  const [currentChainId, setCurrentChainId] = useState(ethChainId);
  const value = { currentChainId, setCurrentChainId };

  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <ChainIdContext.Provider value={value}>
          <UseWalletProvider
            chainId={currentChainId} // 5 GOERLI
            connectors={{
              fortmatic: { apiKey: "" },
              portis: { dAppId: "" },
              walletconnect: { rpcUrl: process.env.REACT_APP_ETH_URL }, // TODO: move to config & define
              walletlink: { url: process.env.REACT_APP_ETH_URL }
            }}
          >
            <UALProviderSwitch>
              <WalletProvider>
                <Router>
                  <Routes />
                </Router>
              </WalletProvider>
            </UALProviderSwitch>
          </UseWalletProvider>
        </ChainIdContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

const Routes = () => {
  useGoogleAnalytics();
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/eth" component={EthPage} />
      <Route exact path="/lock" component={LockPage} />
      <Route exact path="/reverseEth" component={ReverseEthPage} />
      <Route exact path="/voting" component={VotingPage} />
    </Switch>
  );
};

export default App;
