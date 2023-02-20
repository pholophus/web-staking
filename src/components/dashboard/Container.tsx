import { useState, useEffect } from "react";
import List from "../dashboard/List";
import { ethers } from "ethers";
import Menu from "./Menu";

const Container = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  const [poolStatus, setPoolStatus] = useState("inactive");
  const [poolType, setPoolType] = useState("single");
  const [farm, setFarm] = useState(false);

  const menuProps = { setPoolStatus, setPoolType, poolStatus, poolType,farm, setFarm };
  const listProps = { poolStatus, poolType, farm, setFarm };

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
