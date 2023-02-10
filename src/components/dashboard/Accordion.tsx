import { invariant } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Vest } from "../../interface";
import {
  claimReward,
  collectReward,
  approve,
  convertUSD,
} from "../../services";
import { active, greenBtn, inactive } from "../../variable";
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

  // console.log(listVested[index]);

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

  const checkClickable = (type: string) => {
    const vestDateExist =
      listVested[index] &&
      listVested[index].length > 0 &&
      listVested[index][vestIndex].date === "0D:0H:0M";
    switch (type) {
      case "claim":
        setIsClaimActive(
          vestDateExist &&
            (pendingOasis[index] !== "0.00" || pendingOasis[index] !== "0")
        );
        break;
      case "collect":
        setIsCollectActive(
          vestDateExist &&
            (pendingVested[index] !== "0.00" || pendingVested[index] !== "0")
        );
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

  useEffect(() => {
    checkClickable("claim");
    checkClickable("collect");
    converter();
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
      } py-1 bg-[#383737] `}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex justify-between text-white my-7 mx-20">
        <div className="">
          <div className="flex neumorphism rounded-lg py-10 mb-10 w-[22em]">
            <div className="px-8">
              <p className="text-left">PENDING REWARDS:</p>
              <p className="text-left">{`${
                pendingOasis[index] ?? "0.00"
              } $OASIS`}</p>
              <p className="text-left">{`${oasisUSD ?? "0.00"} $USD`}</p>
            </div>
            <div className="px-4 my-auto">
              <button
                disabled={isClaimActive}
                onClick={claimPendingReward}
                className={` ${
                  isClaimActive ? inactive : active
                }  font-bold py-2 px-4 rounded text-black`}
              >
                CLAIM
              </button>
            </div>
          </div>

          <div className="flex neumorphism rounded-lg">
            <div className="px-8 py-10">
              <p className="text-left">VEST REWARDS:</p>
              <p className="text-left">{pendingVested[index] ?? "0"} $OASIS</p>
              <p className="text-left">{vestedUSD ?? "0"} $USD</p>
            </div>

            <div className="px-4 flex flex-col my-auto">
              <button
                onClick={openModal}
                className={`${greenBtn} font-bold py-2 px-4 rounded text-black`}
              >
                {listVested[index] && listVested[index].length > 0
                  ? listVested[index][vestIndex].date
                  : "N/A"}
              </button>
              <button
                disabled={isCollectActive}
                onClick={collectPendingReward}
                className={`${
                  !isCollectActive ? active : inactive
                } font-bold py-2 px-4 mt-4 rounded text-black`}
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
              className={`mb-5 ${active} font-bold py-4 px-[13em] rounded-xl text-black`}
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
