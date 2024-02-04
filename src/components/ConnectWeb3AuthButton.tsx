import React from "react";

import FacebookLogo from "../assets/facebookLogo.png";
import GitHubLogo from "../assets/githubLogo.png";
import GoogleLogo from "../assets/googleLogo.png";
import { useWeb3Auth } from "../services/web3auth";

const ConnectWeb3AuthButton = () => {
  const { connected, loginGoogle, loginFacebook, loginGitHub } = useWeb3Auth();

  if (connected) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-start align-center cursor-pointer w-full"
        style={{ backgroundColor: "#DB4437" }}
        onClick={loginGoogle}
      >
        <img src={GoogleLogo} className="headerLogo" />
        Login via Google
      </div>
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-start align-center cursor-pointer w-full"
        style={{ backgroundColor: "#3b5998" }}
        onClick={loginFacebook}
      >
        <img src={FacebookLogo} className="headerLogo" />
        Login via Facebook
      </div>
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-start align-center cursor-pointer w-full"
        style={{ backgroundColor: "#1f2328" }}
        onClick={loginGitHub}
      >
        <img src={GitHubLogo} className="headerLogo" />
        Login via GitHub
      </div>
    </div>
  );
};
export default ConnectWeb3AuthButton;
