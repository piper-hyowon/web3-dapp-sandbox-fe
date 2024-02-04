import { CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OPENLOGIN_NETWORK, OpenloginAdapter } from "@web3auth/openlogin-adapter";
// eslint-disable-next-line import/no-extraneous-dependencies
import axios, { Axios } from "axios";
import * as React from "react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3AuthNoModal | null;
  connected: boolean;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: string;
  balance: string;
  chainId: string;
  connectedChain: CustomChainConfig;
  loginGoogle: () => Promise<void>;
  loginGitHub: () => Promise<void>;
  loginFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  connected: false,
  user: null,
  address: null,
  balance: null,
  chainId: null,
  connectedChain: chain.Polygon,
  loginGoogle: async () => null,
  loginGitHub: async () => null,
  loginFacebook: async () => null,
  logout: async () => {},
  getUserInfo: async () => null,
  getAddress: async () => "",
  getBalance: async () => "",
  getChainId: async () => "",
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain] = useState<CustomChainConfig>(chain.Polygon);
  const [connected, setConnected] = useState<boolean>(false);

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    const walletProvider = getWalletProvider(web3authProvider);
    setProvider(walletProvider);
    setAddress(await walletProvider.getAddress());
    setBalance(await walletProvider.getBalance());
    setChainId(await walletProvider.getChainId());
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
        const web3AuthInstance = new Web3AuthNoModal({
          clientId,
          chainConfig: chain.Polygon,
          web3AuthNetwork: OPENLOGIN_NETWORK.TESTNET,
        });

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig: chain.Polygon } });
        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          loginSettings: {
            mfaLevel: "optional",
            // redirectUrl: "http://localhost:3001/auth",
            // extraLoginOptions: {
            // redirect_uri: "http://localhost:3001/auth",
            // verifierIdField: "aggregate-sapphire",
            // },
            appState: "state",
          },
          adapterSettings: {
            clientId,
            uxMode: "redirect", // "redirect" | "popup",
            loginConfig: {
              google: {
                verifier: "aggregate-sapphire2",
                verifierSubIdentifier: "w3a-google",
                typeOfLogin: "google",
                clientId: "77004753370-dbrlng5fsfibu93innrnqn3q24l7gn6r.apps.googleusercontent.com",
              },
              facebook: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-facebook",
                typeOfLogin: "facebook",
                clientId: "1222658941886084",
              },
              github: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-github",
                typeOfLogin: "github",
                clientId: "JiyMKN24qJUwnRUYjyq8Adg2yo9lDspL",
              },
              kakao: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-kakao",
                typeOfLogin: "line",
              },
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
              },
            },
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);
        await web3AuthInstance.init();
        if (web3AuthInstance.status === "connected") {
          setWalletProvider(web3AuthInstance.provider);
          const userInfo = await web3AuthInstance.getUserInfo();
          console.log(userInfo);
          setUser(userInfo);
          setConnected(true);
        }
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const loginGoogle = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
      extraLoginOptions: {
        domain: "https://auth.web3auth.io/auth",
        verifierIdField: "email",
      },
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
      alert(await web3Auth.getUserInfo());
    }
  };

  const loginGitHub = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "github",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        verifierIdField: "email",
      },
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);

      const sendApi = async (email: string, _address: string) => {
        try {
          const client: Axios = axios.create({
            baseURL: "http://localhost:3001",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await client.post("http://localhost:3001/auth", {
            address: _address,
            email,
          });
          console.log(response);
          alert(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      await sendApi((await web3Auth.getUserInfo()).email, address);
    }
  };

  const loginFacebook = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "facebook",
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const logout = async () => {
    console.error("Logging out");
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      console.error("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
    setConnected(false);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return;
    }
    const userInfo = await web3Auth.getUserInfo();
    setUser(userInfo);
    console.error(userInfo);
    return userInfo;
  };

  const getAddress = async () => {
    if (!provider) {
      console.error("provider not initialized yet");
      return "";
    }
    const updatedAddress = await provider.getAddress();
    setAddress(updatedAddress);
    console.error(updatedAddress);
    return address;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return "";
    }
    const updatedBalance = await provider.getBalance();

    setBalance(updatedBalance);
    console.error(updatedBalance);
    return balance;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      console.error("web3auth not initialized yet");
      return "";
    }

    await provider.getChainId();
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    chainId,
    connectedChain,
    connected,
    logout,
    loginGoogle,
    loginGitHub,
    loginFacebook,
    getUserInfo,
    getAddress,
    getBalance,
    getChainId,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
