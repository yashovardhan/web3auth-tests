import { Component } from "@angular/core";
import { Web3Auth } from "@web3auth/web3auth";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./evm";
const clientId = "YOUR_CLIENT_ID"; // get from https://dashboard.web3auth.io

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
    title = "angular-app";
    web3auth: Web3Auth | null = null;
    provider: SafeEventEmitterProvider | null = null;
    isModalLoaded = false;

    async ngOnInit() {
      this.web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the testnet RPC we have added, please pass on your own endpoint while creating an app
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["facebook", "google"],
          appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
        }
      });
      const web3auth = this.web3auth

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId,
          network: "testnet",
          uxMode: "redirect", 
          whiteLabel: {
            name: "Your app Name",
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            dark: true, // whether to enable dark mode. defaultValue: false
          }, 
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: {
              reddit: {
                showOnModal: false,
                name: "reddit",
              },
            },
          },
        },
      });

      this.isModalLoaded = true;
    }

    login = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const web3auth = this.web3auth;
    this.provider = await web3auth.connect();
    this.uiConsole("logged in");
    };

    getUserInfo = async () => {
      if (!this.web3auth) {
        this.uiConsole("web3auth not initialized yet");
        return;
      }
      const user = await this.web3auth.getUserInfo();
      this.uiConsole(user);
    };

    onGetStarkAccount = async () => {
      if (!this.provider) {
        this.uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider as SafeEventEmitterProvider);
      const starkaccounts = await rpc.getStarkAccount();
      this.uiConsole(starkaccounts);
    };

    getStarkKey = async () => {
      if (!this.provider) {
        this.uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider as SafeEventEmitterProvider);
      const starkKey =  await rpc.getStarkKey();
      this.uiConsole(starkKey);
    };

    onDeployAccount = async () => {
      if (!this.provider) {
        this.uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider as SafeEventEmitterProvider);
      const deployaccount =  await rpc.deployAccount();
      this.uiConsole(deployaccount);
    };

    logout = async () => {
      if (!this.web3auth) {
        this.uiConsole("web3auth not initialized yet");
        return;
      }
      await this.web3auth.logout();
      this.provider = null;
      this.uiConsole("logged out");
    };

    uiConsole(...args: unknown[]): void {
      const el = document.querySelector("#console-ui>p");
      if (el) {
        el.innerHTML = JSON.stringify(args || {}, null, 2);
      }
    };
}