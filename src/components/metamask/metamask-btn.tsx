import { useState, useEffect } from "react";
import { ethers } from "ethers";

const MetaBtn = () => {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      ethereum.on("accountsChanged", (accounts: any) => {

        const firstSix = accounts[0].slice(0, 6);
        const lastSix = accounts[0].slice(-6);
        const result = firstSix + "..." + lastSix;
        
        setAccountAddress(result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkMetamaskAvailability = async () => {
    if (!ethereum) {
      sethaveMetamask(false);
    }
    sethaveMetamask(true);
  };

  const checkConnectivity = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const firstSix = accounts[0].slice(0, 6);
      const lastSix = accounts[0].slice(-6);
      const result = firstSix + "..." + lastSix;

      setAccountAddress(result);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkMetamaskAvailability();
    checkIfAccountChanged();
    checkConnectivity();
  }, []);

  const disconnectWallet = async () => {
    await window.ethereum.request(
      { 
        method: 'wallet_requestPermissions', 
        params: [{ eth_accounts: {} }] 
      }
    )
    .then(() => {
      // console.log('Logged out of Metamask');
    })
  }

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const firstSix = accounts[0].slice(0, 6);
      const lastSix = accounts[0].slice(-6);
      const result = firstSix + "..." + lastSix;

      setAccountAddress(result);

      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  return (
    <div className="App">
      {
        haveMetamask ? 
          (
            <div>
              {isConnected && (
                <button disabled={true}
                className="btn mt-4 bg-[#FEAE34] text-[#cc4527] w-[150px] h-[41px] rounded-xl"
                onClick={disconnectWallet}
                >
                  {accountAddress}
                </button>
              )}
              {isConnected == false && (
                <button
                  className="btn mt-4 bg-[#FEAE34] text-[#cc4527] w-[250px] h-[41px] rounded-xl"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          ) 
        : 
          (
            <p>Please Install MataMask</p>
          )
      }
    </div>
  );
};

export default MetaBtn;
