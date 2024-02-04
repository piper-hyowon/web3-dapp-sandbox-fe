import React from "react";

import AccountDetails from "../components/AccountDetails";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import { useWeb3Auth } from "../services/web3auth";

function HomePage() {
  const { connected } = useWeb3Auth();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {connected ? (
          <>
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <AccountDetails />
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default HomePage;
