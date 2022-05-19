import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { CompiledContract, defaultProvider } from "starknet";
import CompiledAccountContractAbi from "./account.json";
import BN from "bn.js";
import { ec as elliptic } from "elliptic";
import { grindKey, ec as starkEc } from "@toruslabs/starkware-crypto";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error: unknown) {
      console.error((error as Error).message);
      throw error;
    }
  }

  getStarkAccount = async (): Promise<elliptic.KeyPair | undefined> => {
    try {
      const starkEcOrder = starkEc.n;
      const provider = this.provider;
      const privKey = await provider.request({ method: "private_key" });
      const account = starkEc.keyFromPrivate(
        grindKey(privKey as string, starkEcOrder as BN),
        "hex"
      );
      return account;
    } catch (error: unknown) {
      console.error((error as Error).message);
      throw error;
    }
  };

  getStarkKey = async (): Promise<string | undefined> => {
    try {
      const account = await this.getStarkAccount();
      return account?.getPrivate("hex");
    } catch (error: unknown) {
      console.error((error as Error).message);
      throw error;
    }
  };

  deployAccount = async (): Promise<void> => {
    try {
      const account = await this.getStarkAccount();
      if (account) {
        const contract = CompiledAccountContractAbi.toString();
        const response = await defaultProvider.deployContract({
          contract: contract
        })

        console.log("accountResponse", response);
      }
    } catch (error: unknown) {
      console.error((error as Error).message);
      throw error;
    }
  };
}
