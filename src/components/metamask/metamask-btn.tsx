import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaBtn = () => {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [currentAccount, setCurrentAccount] = useState("");  
  const [isConnected, setIsConnected] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  const checkIfAccountChanged = async () => {
    try {
      const {ethereum} = window;
      ethereum.on('accountsChanged', (accounts: any) => {
        setAccountAddress(accounts[0]);
      });

    } catch (error) {
      console.log(error);
    }
  }

  const checkMetamaskAvailability = async () => {
    if (!ethereum) {
      sethaveMetamask(false);
    }
    sethaveMetamask(true);
  };

  const checkConnectivity = async () => {

    const accounts = await ethereum.request({method: 'eth_accounts'}); 

    if(accounts.length > 0){
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      setAccountAddress(accounts[0]);
      setIsConnected(true)
    }else{
      setIsConnected(false)
    }

  }

  useEffect(() => {
    checkMetamaskAvailability();
    checkIfAccountChanged();
    checkConnectivity();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccountAddress(accounts[0]);
      
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  return (
    <div className="App">
      {haveMetamask ? (
          <div>
            {isConnected && (
              <div className="card">
                <div className="card-row">
                  <p>
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
              </div>
            )}
            {isConnected == false && (
              <button className="btn" onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MataMask</p>
        )}
    </div>
  );
}

export default MetaBtn;