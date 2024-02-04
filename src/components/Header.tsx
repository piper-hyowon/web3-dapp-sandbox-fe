import Hamburger from "hamburger-react";
import React, { useState } from "react";

import { useWeb3Auth } from "../services/web3auth";
import DisconnectWeb3AuthButton from "./DisconnectWeb3AuthButton";

const Header = () => {
  const { connected } = useWeb3Auth();

  const [isOpen, setOpen] = useState(false);

  return (
    <header className="sticky max-w-screen z-10">
      <div className="px-4 py-4 mx-auto sm:py-2 sm:px-6 md:px-8 border-b">
        <div className="justify-between items-center flex">
          <div className="flex-col flex-row mt-0 items-center lg:flex hidden">
            <DisconnectWeb3AuthButton />
          </div>
          {connected && (
            <div className="flex-col flex-row mt-0 items-center flex lg:hidden">
              <Hamburger toggled={isOpen} toggle={setOpen} size={25} direction="right" />
            </div>
          )}
        </div>
      </div>
      {connected}
    </header>
  );
};

export default Header;
