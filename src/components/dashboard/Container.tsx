import { useState, useEffect } from "react";
import List from "../dashboard/List";
import { ethers } from "ethers";
import Menu from "./Menu";

const Container = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  const [accountAddress, setAccountAddress] = useState("");

  useEffect(() => {
    checkIfAccountChanged();
  }, []);

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      await ethereum.on("accountsChanged", (accounts: any) => {
        setAccountAddress(accounts[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full md:w-[1100px] md:mx-auto">
        <Menu />
        <List />
      </div>
    </>
  );
};

export default Container;
