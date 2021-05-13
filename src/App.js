import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";
import Error from "./features/error";
import Loading from "./features/loading";
import ErrorBoundary from "./components/errorBoundary";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import {
  UALProviderSwitch,
  WalletProvider,
} from "./context/walletProvider/walletProviderFacade";

const HomePage = lazy(() => import("./features/home"));
const EthPage = lazy(() => import("./features/eth"));
const LockPage = lazy(() => import("./features/lock"));

function App() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <UseWalletProvider
          chainId={1} // 5 GOERLI // TODO: make it flexible (137 for Matic)
          connectors={{
            fortmatic: { apiKey: "" },
            portis: { dAppId: "" },
            walletconnect: { rpcUrl: process.env.REACT_APP_ETH_URL },
            walletlink: { url: process.env.REACT_APP_ETH_URL },
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
      </Suspense>
    </ErrorBoundary>
  );
}

function Routes() {
  useGoogleAnalytics();
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/eth" component={EthPage} />
      <Route exact path="/lock" component={LockPage} />
    </Switch>
  );
}

export default App;
