import React, { useEffect, useState } from "react";
import single from "../../../images/single.png";
import lp from "../../../images/lp.png";

export const MenuMobile = ({
  setPoolStatus,
  setPoolType,
  poolStatus,
  poolType,
  farm,
  setFarm,
}: any) => {
  
  const [txt, setTxt] = useState("Single Staking");

  const handleClickStatus = (event: any) => {
    setPoolStatus(event.target.value);
  };

  const handleClickPoolType = (event: any) => {
    setPoolType(event.target.value);
  };

  const myStake = () => {
    setFarm(!farm);
  };

  useEffect(() => {
    if (poolType === "single") {
      setTxt(single);
    } else {
      setTxt(lp);
    }
  });

  return (
    <div className="text-white text-left">
      <img className="mt-10 w-[80%]" src={txt} alt="" />
      <div className="flex justify-between text-[20px] my-10">
        <div>
          <p>Filter by</p>
          <div className="flex bg-[#292929] rounded-md w-[170px]">
            <button
              onClick={handleClickStatus}
              value="active"
              className={`px-3 py-2 ${
                poolStatus === "active" ? "bg-[#2AB930] rounded-md" : ""
              }`}
            >
              Live
            </button>
            <button
              onClick={handleClickStatus}
              value="inactive"
              className={`px-5 py-2 ${
                poolStatus === "inactive" ? "bg-[#2AB930] rounded-md" : ""
              }`}
            >
              Finished
            </button>
          </div>
        </div>
        {/* <div className="mr-[24rem]">
          <p>Staked Only</p>
          <div className="pt-2">
            <label className="relative inline-flex items-center mr-5 cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={farm}
              />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"
                onClick={myStake}
              />
            </label>
          </div>
        </div> */}
        <div className="flex justify-between w-[22rem] text-[30px] hidden">
          <button
            className={poolType === "single" ? "text-[#FEAE34]" : ""}
            value="single"
            onClick={handleClickPoolType}
          >
            Single
          </button>
          <button
            className={poolType === "lp" ? "text-[#FEAE34]" : ""}
            value="lp"
            onClick={handleClickPoolType}
          >
            Liquidity Pools
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuMobile;
