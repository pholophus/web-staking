import React, { useState } from "react";

export const Menu = ({
  setPoolStatus,
  setPoolType,
  poolStatus,
  poolType
}: any) => {
  const activeButtonClass = "bg-yellow-600 w-[100px] py-2 rounded-lg";
  const inactiveButtonClass = "w-[100px] py-2";
  const activeButtonFarm = "bg-green-600 w-[90px] py-2 rounded-lg mr-2";
  const inactiveButtonFarm = "w-[90px] py-2 mr-2";


  const handleClickStatus = (event: any) => {
    setPoolStatus(event.target.value);
  };

  const handleClickPoolType = (event: any) => {
    setPoolType(event.target.value);
  };

  const poolButtons = [
    {
      value: "single",
      className: poolType === "single" ? activeButtonFarm : inactiveButtonFarm,
      onClick: handleClickPoolType,
      label: "SINGLE",
    },
    {
      value: "lp",
      className: poolType === "lp" ? activeButtonFarm : inactiveButtonFarm,
      onClick: handleClickPoolType,
      label: "LP",
    },
  ];

  const statusButtons = [
    {
      value: "active",
      className:
        poolStatus === "active" ? activeButtonClass : inactiveButtonClass,
      onClick: handleClickStatus,
      label: "ACTIVE",
    },
    {
      value: "inactive",
      className:
        poolStatus === "inactive" ? activeButtonClass : inactiveButtonClass,
      onClick: handleClickStatus,
      label: "INACTIVE",
    },
    {
      value: "myFarm",
      className:
        poolStatus === "myFarm" ? activeButtonClass : inactiveButtonClass,
      onClick: handleClickStatus,
      label: "MY FARM",
    },
  ];

  return (
    <div className="border rounded-lg mt-20 mb-4 py-5 bg-[#212121] text-white">
      <div className="flex justify-between px-[5%]">
        <div>
          {poolButtons.map(({ value, className, onClick, label }) => (
            <button value={value} className={className} onClick={onClick} key={value}>
              {label}
            </button>
          ))}
        </div>
        <div>
          {statusButtons.map(({ value, className, onClick, label }) => (
            <button value={value} className={className} onClick={onClick} key={value}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
