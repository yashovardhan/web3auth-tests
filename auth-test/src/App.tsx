import { useEffect, useState } from "react";
import { Web3AuthCore } from "@web3auth/core";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./evm";

const clientId = "BDzbs6kQhq9pbuZlk_-oDnmVKl-pd8xFADhc9w4A5HdhCTbGX26DgCiWO03raOLe9ZNkiekJ29NFQ7gpSrzkTlg"; 

function App() {
  const [web3auth, setWeb3Auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthCore({
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId:  "0x1",
          }
        });
        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: "testnet",
            uxMode: "popup",
            loginConfig: {
            jwt: {
              name: "Auth0 Login",
              verifier: "auth0-project",
              typeOfLogin: "jwt",
              clientId: "4Yt9XbUpS73p6WB04rL4q5ejSdYNV9H8",
              },
            },
          },
        });

        web3auth.configureAdapter(openloginAdapter);
        setWeb3Auth(web3auth);
        await web3auth.init();
      } catch (error) {
        console.error(error);
      }
    };
    
      
    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3AuthProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      relogin: true,
      loginProvider: "jwt",
      extraLoginOptions: {
        domain: "https://yash-test-web3auth.us.auth0.com",
        verifierIdField: "sub",
      },
    });

    setProvider(web3AuthProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log("User info", user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    console.log(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    console.log(result);
  };

  const signTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signTransaction();
    console.log(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendTransaction();
    console.log(result);
  };

  return (
    <div>
      {
      !provider ? 
      <div>
      <button onClick={login}>
        Log In
      </button>
      <button onClick={logout}>
        Log Out
      </button>
      </div> : 
      <div>
      <button onClick={getUserInfo}>
        Get User Info
      </button>
      <button onClick={getAccounts}>
      getAccounts
      </button>
      <button onClick={getBalance}>
      getBalance
      </button>
      <button onClick={signMessage}>
      signMessage
      </button>
      <button onClick={signTransaction}>
      signTransaction
      </button>
      <button onClick={sendTransaction}>
      sendTransaction
      </button>
      <button onClick={logout}>
        Log Out
      </button>
    </div>
    }</div>
  );
}

export default App;
