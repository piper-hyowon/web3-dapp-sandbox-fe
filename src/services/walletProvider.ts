import { IProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
}

export const getWalletProvider = (provider: IProvider | null): IWalletProvider => {
  return evmProvider(provider);
};
