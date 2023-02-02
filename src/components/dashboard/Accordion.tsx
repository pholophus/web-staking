import { useState } from "react";
import Modal from "./Modal";
import { link } from "../../svg";
import { claimReward, collectReward, approve } from "../../services";
import StakeInput from "./StakeInput";

const Accordion = ({
  visible,
  index,
  selectedIndex,
  pendingOasis,
  pendingVested,
  sc,
  stakedAmount,
  approvalCheck,
}: any) => {
  const claimPendingReward = () => {
    claimReward(sc);
  };

  const collectPendingReward = () => {
    collectReward(sc);
  };

  const showStake = async () => {
    if (!approvalCheck[index]) {
      await approve(sc);
    }
  };

  return (
    <div
      className={`${
        visible && selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#383737] `}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex justify-between text-white my-7 mx-20">
        <div className="">
          <div className="flex neumorphism rounded-lg py-10 mb-10 w-[22em]">
            <div className="px-8">
              <p className="text-left">PENDING REWARDS:</p>
              <p className="text-left">{pendingOasis[index]} $OASIS</p>
            </div>
            <div className="px-4">
              <button
                onClick={claimPendingReward}
                className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500 font-bold py-2 px-4 rounded text-black"
              >
                CLAIM
              </button>
            </div>
          </div>

          <div className="flex neumorphism rounded-lg py-10">
            <div className="px-8">
              <p className="text-left">VESTED REWARDS:</p>
              <p className="text-left">{pendingVested[index]} $OASIS</p>
            </div>
            <div className="px-4">
              <button
                onClick={collectPendingReward}
                className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500 font-bold py-2 px-4 rounded text-black"
              >
                COLLECT
              </button>
            </div>
          </div>
        </div>

        <div className=" flex items-center">
          <div
            className={`mx-auto ${approvalCheck[index]  ? "hidden" : "block"}`}
          >
            <p className="text-gray-400 text-start">ENABLE FARM</p>
            <button
              className="mb-5 bg-yellow-600 hover:bg-yellow-700 font-bold py-4 px-[13em] rounded-xl text-black"
              onClick={showStake}
            >
              ENABLE
            </button>
          </div>

          {/* <div className={enableStake.stake}> */}
          <div className={approvalCheck[index]  ? "block" : "hidden"}>
            <StakeInput {...{ sc, stakedAmount, index }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
