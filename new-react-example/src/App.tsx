import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import RPC from "./evm";
import "./App.css";

const clientId = "BP-HcHP_eD6X-TEZhh_yTC2p9skVcoe2iwqcvDH2jV2kHxEr7U8_ZsMARgiwl_5jX9FYRNuKjtzBHfam_GUe6qg"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {

      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth", // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
        },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId,
          network: "testnet",
          uxMode: "redirect",  
          loginConfig: {
            // Add login configs corresponding to the providers on modal
            // Google login
            google: {
              name: "Custom Auth Login",
              verifier: "integration-builder", // Please create a verifier on the developer dashboard and pass the name here
              typeOfLogin: "google", // Pass on the login provider of the verifier you've created
              clientId: "995051377270-uj3oq6tnjv9du3jj11202km4lclqn4mp.apps.googleusercontent.com", // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
            },
          },
          whiteLabel: {
            logoLight: "https://www.yashovardhan.dev/assets/img/logo.png",
            logoDark: "https://www.yashovardhan.dev/assets/img/logo.png",
            defaultLanguage: "en",
            dark: true, // whether to enable dark mode. defaultValue: false
          }, 
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      const torusPlugin = new TorusWalletConnectorPlugin({
        walletInitOptions: {
          whiteLabel: {
            theme: {
              isDark: false,
              colors: {
                primary: "#00a8ff",
              }
            },
            logoLight: "https://www.yashovardhan.dev/assets/img/logo.png",
            logoDark: "https://www.yashovardhan.dev/assets/img/logo.png",
          },
        }
      });
      await web3auth.addPlugin(torusPlugin);

      setWeb3auth(web3auth);

      await web3auth.initModal();

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

    const getAccounts = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const userAccount = await rpc.getAccounts();
      uiConsole(userAccount);
    };

    const getBalance = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const balance = await rpc.getBalance();
      uiConsole(balance);
    };

    const signMessage = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const result = await rpc.signMessage();
      uiConsole(result);
    };

    const signTransaction = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const result = await rpc.signTransaction();
      uiConsole(result);
    };

    const sendTransaction = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const result = await rpc.signAndSendTransaction();
      uiConsole(result);
    };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
        <button onClick={getAccounts} className="card">
          Get Accounts
        </button>
        <button onClick={getBalance} className="card">
          Get Balance
        </button>
        <button onClick={signMessage} className="card">
          Sign Message
        </button>
        <button onClick={signTransaction} className="card">
          Sign Transaction
        </button>
        <button onClick={sendTransaction} className="card">
          Send Transaction
        </button>
  
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app" target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;