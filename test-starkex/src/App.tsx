import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useEffect, useState } from "react";
import "./App.css";
import RPC from "./starkex";
const clientId = "YOUR_CLIENT_ID"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
    const initParams = {}
  
        const web3AuthCtorParams = {
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId:  "0x1",
            rpcTarget: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // This is the testnet RPC we have added, please pass on your own endpoint while creating an app
          }
        }
        const web3auth = new Web3Auth(web3AuthCtorParams);
const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId,
        network: "testnet",
        uxMode: "redirect",
      },
    });
        web3auth.configureAdapter(openloginAdapter);
        subscribeAuthEvents(web3auth);
        setWeb3auth(web3auth);
        await web3auth.initModal(initParams);
      } catch (error) {
        console.error(error);
      }
    };

    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log("Yeah!, you are successfully logged in", data);
        setProvider(web3auth.provider);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error("some error or user has cancelled login request", error);
      });
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const provider = await web3auth.connect();
    setProvider(provider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const onGetStarkHDAccount = async () => {
    const RPC = new StarkExRPC(provider as SafeEventEmitterProvider);
    const starkaccounts = await RPC.getStarkAccount();
    uiConsole(starkaccounts);
  };

  const onMintRequest = async () => {
    const RPC = new StarkExRPC(provider as SafeEventEmitterProvider);
    const request = await RPC.onMintRequest();
    uiConsole(request);
  };

  const onDepositRequest = async () => {
    const RPC = new StarkExRPC(provider as SafeEventEmitterProvider);
    const request = await RPC.onDepositRequest();
    uiConsole(request);
  };

  const onWithdrawalRequest = async () => {
    const RPC = new StarkExRPC(provider as SafeEventEmitterProvider);
    const request = await RPC.onWithdrawalRequest();
    uiConsole(request);
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
      <button onClick={onGetStarkHDAccount} className="card">
        Get Stark Accounts
      </button>
      <button onClick={onMintRequest} className="card">
        Mint Request
      </button>
      <button onClick={onDepositRequest} className="card">
        Deposit Request
      </button>
      <button onClick={onWithdrawalRequest} className="card">
        Withdraw Request
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