import { invariant } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Vest } from "../../interface";
import {
  claimReward,
  collectReward,
  approve,
  convertUSD,
} from "../../services/stakingServices";
import { active, greenBtn, inactive, listIcon } from "../../variable";
import Modal from "./Modal";
import StakeInput from "./StakeInput";
import countdown from "../../images/countdown.png";

const Accordion = ({
  visible,
  index,
  selectedIndex,
  pendingOasis,
  pendingVested,
  sc,
  stakedAmount,
  approvalCheck,
  listVested,
}: any) => {
  const [oasisUSD, setOasisUSD] = useState<any>("");
  const [vestedUSD, setVestedUSD] = useState<any>("");
  const [stakeUSD, setStakeUSD] = useState<any>("");
  const [isClaimActive, setIsClaimActive] = useState(false);
  const [isCollectActive, setIsCollectActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vestIndex, setVestIndex] = useState(0);

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

  const openModal = async () => {
    if (listVested[index]) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const vestCollectStatus = () => {
    if (listVested[index]) {
      return (
        listVested[index] &&
        listVested[index].length > 0 &&
        listVested[index][vestIndex].collected === false
      );
    }
  };

  // const checkClickable = (type: string) => {
  //   switch (type) {
  //     case "claim":
  //       setIsClaimActive(
  //         pendingOasis[index] !== "0.00" || pendingOasis[index] !== "0"
  //       );
  //       break;
  //     case "collect":
  //       setIsCollectActive(!vestCollectStatus());
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const converter = async () => {
    const convertedOasis = await convertUSD(pendingOasis[index]);
    const convertedVested = await convertUSD(pendingVested[index]);
    const convertedStake = await convertUSD(stakedAmount[index]);
    setOasisUSD(convertedOasis);
    setVestedUSD(convertedVested);
    setStakeUSD(convertedStake);
  };

  const findIndexByNotCollectedYet = () => {
    const arrays: Vest = listVested[index];

    let num = -1;
    if (!arrays) return;
    for (const [i, j] of Object.entries(arrays)) {
      if (j.collected === false) {
        num = Number(i);
      }
    }
    return num ?? "";

    //* if return true: not collect yet
    // let hasCollect = listVested[index] && listVested[index].length > 0 && listVested[index][vestIndex].collected === false
    // return hasCollect;
  };

  useEffect(() => {
    // checkClickable("claim");
    // checkClickable("collect");
    converter();
    const index = findIndexByNotCollectedYet();
    if (index !== undefined) {
      setVestIndex(index);
    }
  }, [
    approvalCheck[index],
    pendingOasis[index],
    pendingVested[index],
    listVested[index],
    isClaimActive,
  ]);

  // console.log(visible)

  return (
    <div
      className={`${
        visible && selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#171616] text-white rounded-b-xl border-t border-[#3A3A3A]`}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex text-white mx-4 my-10">

        <div className="mr-3 pr-2 my-auto text-left text-[13px]">
          <p className="mb-4">Deposit Lock Duration : 360 Days</p>
          <p className="mb-4">Pool Max Cap : 135000 $OASIS</p>
        </div>

        <div className="mr-3 border-[#3D3D3D] border-2 w-[220px] rounded-lg py-6 my-auto h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E]">Pending Rewards</p>
            <p className="text-[24px]">{`${
              pendingOasis[index] ?? "0.00"
            } $OASIS`}</p>
            <p className="mb-5">{`(${oasisUSD ?? "0.00"} $USD)`}</p>
          </div>
          <div className="">
            <button
              disabled={isClaimActive}
              onClick={claimPendingReward}
              className={` ${
                isClaimActive ? inactive : active
              }  font-bold py-2 px-12 rounded `}
            >
              CLAIM
            </button>
          </div>
        </div>

        <div className="mr-3 border-[#3D3D3D] border-2 w-[290px] rounded-lg py-6 my-auto h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E]">Vest Rewards</p>
            <p className="text-[24px]">{pendingVested[index] ?? "0"} $OASIS</p>
            <p className="mb-5">{`(${vestedUSD ?? "0"} $USD)`}</p>
          </div>

          <div className="px-4 flex flex-col my-auto">
            <div className="flex justify-center">
              <button
                onClick={openModal}
                className={` font-bold py-2 px-4 rounded border border-[#3D3D3D]`}
              >
                <div className="flex">
                  <img src={countdown} className="scale-[0.8] mr-2" alt="" />
                  <p className="">
                    {listVested[index] && listVested[index].length > 0
                      ? listVested[index][vestIndex]?.date
                      : "0D:0H:0M"}
                  </p>
                </div>
              </button>
              <button
                disabled={isCollectActive}
                onClick={collectPendingReward}
                className={`${
                  isCollectActive ? inactive : active
                } font-bold py-2 px-4 rounded `}
              >
                COLLECT
              </button>
            </div>
          </div>
        </div>

        <div className="w-[280px] flex items-center">
          <div>
            <StakeInput
              {...{ sc, stakedAmount, index, approvalCheck, showStake, visible, selectedIndex }}
            />
          </div>
        </div>

        <div className={approvalCheck[index] ? "block" : "hidden"}>
          {showModal && (
            <Modal
              {...{
                showModal,
                setShowModal,
                index,
                listVested,
                collectPendingReward,
                isCollectActive,
                stakeUSD,
                selectedIndex
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
