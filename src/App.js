import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";

import Error from "./features/error";
import Loading from "./features/loading";
import ErrorBoundary from "./components/errorBoundary";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import { useIframeSync } from "./hooks/useIframeSync";
import {
  UALProviderSwitch,
  WalletProvider
} from "./context/walletProvider/walletProviderFacade";
import { WrongChainProvider } from "./context/wrongChainContext";

import { TransactionProvider } from "./context/transactionContext";

import {
  ethChainId,
  fortmaticApiKey,
  portisId,
  walletConnectRpcUrl,
  walletLinkUrl
} from "./config";
import { isMetamaskMobileAndIframe } from "./utils/metamaskMobileDetector";

const InitPage = lazy(() => import("./features/init"));
const HomePage = lazy(() => import("./features/home"));
const EthPage = lazy(() => import("./features/eth"));
const ReverseEthPage = lazy(() => import("./features/reverseEth"));
const LockPage = lazy(() => import("./features/Lock/lock"));
const VotingPage = lazy(() => import("./features/Voting/voting"));
const StatsPage = lazy(() => import("./features/Stats/stats"));
const RafflesPage = lazy(() => import("./features/Raffles/raffles"));
const TreasuryPage = lazy(() => import("./features/Treasury/treasury"));

function App() {
  isMetamaskMobileAndIframe();
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <UseWalletProvider
          chainId={ethChainId} // 5 GOERLI
          connectors={{
            frame: {},
            injected: {},
            fortmatic: { apiKey: fortmaticApiKey },
            portis: { dAppId: portisId },
            walletconnect: { rpcUrl: walletConnectRpcUrl },
            walletlink: { url: walletLinkUrl }
          }}
        >
          <UALProviderSwitch>
            <WalletProvider>
              <WrongChainProvider>
                <TransactionProvider>
                  <Router>
                    <Routes />
                  </Router>
                </TransactionProvider>
              </WrongChainProvider>
            </WalletProvider>
          </UALProviderSwitch>
        </UseWalletProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

const Routes = () => {
  useGoogleAnalytics();
  useIframeSync();
  return (
    <Switch>
      <Route exact path="/" component={InitPage} />
      <Route exact path="/bridge" component={HomePage} />
      <Route exact path="/eth" component={EthPage} />
      <Route exact path="/lock" component={LockPage} />
      <Route exact path="/reverseEth" component={ReverseEthPage} />
      <Route exact path="/voting" component={VotingPage} />
      <Route exact path="/stats" component={StatsPage} />
      <Route exact path="/raffles" component={RafflesPage} />
      <Route exact path="/treasury" component={TreasuryPage} />
    </Switch>
  );
};

export default App;
