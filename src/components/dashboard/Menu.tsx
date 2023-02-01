import React, { useState } from "react";

export const Menu = ({ setPoolStatus }: any) => {
  const activeButtonClass = "bg-yellow-600 w-[100px] py-2 rounded-lg";
  const inactiveButtonClass = "w-[100px] py-2";

  const activeButtonFarm = "bg-green-600 w-[130px] py-2 rounded-lg mr-2";
  const inactiveButtonFarm = "w-[130px] py-2 mr-2";

  const [selectedFarm, setSelectedFarm] = useState("staking");
  const [isActive, setIsActive] = useState("inactive");

  const handleClick = (event: any) => {
    setIsActive(event.target.value);
    setPoolStatus(event.target.value);
  };

  return (
    <div className="border rounded-lg mt-20 mb-4 py-5 bg-[#212121] text-white">
      <div className="flex justify-between px-[5%]">
        <div>
          <button
            value="staking"
            className={
              selectedFarm === "staking" ? activeButtonFarm : inactiveButtonFarm
            }
            onClick={() => setSelectedFarm("staking")}
          >
            STAKING
          </button>
          <button
            className={
              selectedFarm === "liquidity-pool"
                ? activeButtonFarm
                : inactiveButtonFarm
            }
            onClick={() => setSelectedFarm("liquidity-pool")}
          >
            LIQUIDITY POOL
          </button>
        </div>
        <div>
          <button
            value="active"
            className={
              isActive === "active" ? activeButtonClass : inactiveButtonClass
            }
            onClick={handleClick}
          >
            ACTIVE
          </button>
          <button
            value="inactive"
            className={
              isActive === "inactive" ? activeButtonClass : inactiveButtonClass
            }
            onClick={handleClick}
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
