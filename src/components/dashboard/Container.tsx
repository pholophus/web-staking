import { useState, useEffect } from "react";
import List from "../dashboard/List";
import { ethers } from "ethers";
import Menu from "./Menu";
import { getAccount } from "../../services/stakingServices";

const Container = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  const [poolStatus, setPoolStatus] = useState("inactive");
  const [poolType, setPoolType] = useState("single");

  const [menuProps, setMenuProps] = useState<any>({ setPoolStatus, setPoolType, poolStatus, poolType })
  const [listProps, setListProps] = useState<any>({ poolStatus, poolType })


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
