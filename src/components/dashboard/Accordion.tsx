import { invariant } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Vest } from "../../interface";
import {
  claimReward,
  collectReward,
  approve,
  convertUSD,
} from "../../services";
import { active, greenBtn, inactive, listIcon } from "../../variable";
import Modal from "./Modal";
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
  listVested,
}: any) => {
  const [oasisUSD, setOasisUSD] = useState<any>("");
  const [vestedUSD, setVestedUSD] = useState<any>("");
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
    return (
      listVested[index] &&
      listVested[index].length > 0 &&
      listVested[index][vestIndex].collected === false
    );
  };

  const checkClickable = (type: string) => {
    switch (type) {
      case "claim":
        setIsClaimActive(
          pendingOasis[index] !== "0.00" || pendingOasis[index] !== "0"
        );
        break;
      case "collect":
        setIsCollectActive(!vestCollectStatus());
        break;
      default:
        break;
    }
  };

  const converter = async () => {
    const convertedOasis = await convertUSD(pendingOasis[index]);
    const convertedVested = await convertUSD(pendingVested[index]);
    setOasisUSD(convertedOasis);
    setVestedUSD(convertedVested);
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
    checkClickable("claim");
    checkClickable("collect");
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

  return (
    <div
      className={`${
        visible && selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#171616] text-white rounded-b-xl border-t border-[#3A3A3A]`}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex justify-between text-white my-7 mx-5">


        <div className="pr-2 ml-2 my-auto text-left text-[13px]">
          <p className="mb-4">Deposit Lock Duration : 360 Days</p>
          <p className="mb-4">Rewards Vesting Duration : 360 Days After Claim</p>
          <p className="mb-4">Pool Max Cap : 135000 $OASIS</p>
        </div>
        






          <div className="mr-10 border-[#3D3D3D] border-2 w-[220px] rounded-lg py-6 my-auto h-[13rem]">
            <div className="">
              <p className="text-[20px] text-[#8E8E8E]">Pending Rewards</p>
              <p className="text-[24px]">{`${pendingOasis[index] ?? "0.00"} $OASIS`}</p>
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










          <div className="mr-12 border-[#3D3D3D] border-2 w-[250px] rounded-lg py-6 my-auto h-[13rem]">
            <div className="">
              <p className="text-[20px] text-[#8E8E8E]">Vest Rewards</p>
              <p className="text-[24px]">{pendingVested[index] ?? "0"} $OASIS</p>
              <p className="mb-5">{`(${vestedUSD ?? "0"} $USD)`}</p>
            </div>

            <div className="px-4 flex flex-col my-auto">
              <p className="text-green-500">
                {listVested[index] && listVested[index].length > 0
                  ? listVested[index][vestIndex]?.date
                  : ""}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={openModal}
                  className={` font-bold py-2 px-4 rounded border border-[#3D3D3D]`}
                  >
                  ##TIME
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






          <div className=" flex items-center">
          <div
            className={`mx-auto ${approvalCheck[index] ? "hidden" : "block"}`}
          >
            <p className="text-gray-400 text-start">ENABLE FARM</p>
            <button
              className={`mb-5 ${active} font-bold py-4 px-[13em] rounded-xl `}
              onClick={showStake}
            >
              ENABLE
            </button>
          </div>
          <div>
            <div className={approvalCheck[index] ? "block" : "hidden"}>
              <StakeInput {...{ sc, stakedAmount, index }} />
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
                  }}
                />
              )}
            </div>
          </div>
          </div>







      </div>
    </div>
  );
};

export default Accordion;
