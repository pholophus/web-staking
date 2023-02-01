import React, { useState } from "react";

export const Menu = ({
  setPoolStatus,
  setPoolType,
  poolStatus,
  poolType,
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

  return (
    <div className="border rounded-lg mt-20 mb-4 py-5 bg-[#212121] text-white">
      <div className="flex justify-between px-[5%]">
        <div>
          <button
            value="single"
            className={
              poolType === "single" ? activeButtonFarm : inactiveButtonFarm
            }
            onClick={handleClickPoolType}
          >
            SINGLE
          </button>
          <button
            value="lp"
            className={
              poolType === "lp" ? activeButtonFarm : inactiveButtonFarm
            }
            onClick={handleClickPoolType}
          >
            LP
          </button>
        </div>
        <div>
          <button
            value="active"
            className={
              poolStatus === "active" ? activeButtonClass : inactiveButtonClass
            }
            onClick={handleClickStatus}
          >
            ACTIVE
          </button>
          <button
            value="inactive"
            className={
              poolStatus === "inactive"
                ? activeButtonClass
                : inactiveButtonClass
            }
            onClick={handleClickStatus}
          >
            INACTIVE
          </button>
        </div>
        <div className="py-2">
          <input type="checkbox" name="staked" value="staked" />
          <label>STAKED</label>
        </div>
      </div>
    </div>
  );
};

export default Menu;
