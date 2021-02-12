import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";
import Error from "./features/error";
import Loading from "./features/loading";
import ErrorBoundary from "./components/errorBoundary";
import { TokensProvider } from "./context/tokensProvider/tokensContext";
import { UserTokensProvider } from "./context/userTokensProvider/userTokensContext";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import {
  UALProviderSwitch,
  WalletProvider,
} from "./context/walletProvider/walletProviderFacade";

const HomePage = lazy(() => import("./features/home"));

function App() {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <UseWalletProvider
          chainId={1}
          connectors={{
            fortmatic: { apiKey: "" },
            portis: { dAppId: "" },
            walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
            walletlink: { url: "https://mainnet.eth.aragon.network/" },
          }}
        >
          <UALProviderSwitch>
            <WalletProvider>
              <TokensProvider>
                <UserTokensProvider>
                  <Router>
                    <Routes />
                  </Router>
                </UserTokensProvider>
              </TokensProvider>
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
    </Switch>
  );
}

export default App;
