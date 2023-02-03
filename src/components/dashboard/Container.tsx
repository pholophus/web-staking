import { useState, useEffect } from "react";
import List from "../dashboard/List";
import { ethers } from "ethers";
import Menu from "./Menu";
import Modal from "./Modal";

const Container = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  const [accountAddress, setAccountAddress] = useState("");
  const [poolStatus, setPoolStatus] = useState("inactive");
  const [poolType, setPoolType] = useState("single");

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

  const menuProps = { setPoolStatus, setPoolType, poolStatus, poolType };
  const listProps = { poolStatus, poolType };

  return (
    <>
      <div className={`w-full md:w-[1100px] md:mx-auto`}>
        <Menu {...menuProps} />
        <List {...listProps} />
      </div>
    </>
  );
};

export default Container;
