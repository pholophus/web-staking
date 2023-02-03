import { useEffect, useState } from "react";
import {
  claimReward,
  collectReward,
  approve,
  convertUSD,
} from "../../services";
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
  // setShowModal,
  listVested,
}: any) => {
  const [oasisUSD, setOasisUSD] = useState<any>("");
  const [vestedUSD, setVestedUSD] = useState<any>("");
  const [isDisabledOasis, setIsDisabledOasis] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCollected, setIsCollected] = useState<boolean>(false);

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
    setShowModal(true);
  };

  const buttonCheck = () => {
    if (pendingOasis[index] !== ("0.00" || "0")) {
      setIsDisabledOasis(false);
    }
  };

  const converter = async () => {
    const convertedOasis = await convertUSD(pendingOasis[index]);
    const convertedVested = await convertUSD(pendingVested[index]);
    setOasisUSD(convertedOasis);
    setVestedUSD(convertedVested);
  };

  useEffect(() => {
    buttonCheck();
    converter();
  }, [
    approvalCheck[index],
    pendingOasis[index],
    pendingVested[index],
    isDisabledOasis,
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
                disabled={isDisabledOasis}
                onClick={claimPendingReward}
                className={` ${
                  !isDisabledOasis
                    ? "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500"
                    : "bg-gray-500"
                }  font-bold py-2 px-4 rounded text-black`}
              >
                CLAIM
              </button>
            </div>
          </div>

          <div className="flex neumorphism rounded-lg">
            <div className="px-8 py-10">
              <p className="text-left">VESTED REWARDS:</p>
              <p className="text-left">{pendingVested[index] ?? "0"} $OASIS</p>
              <p className="text-left">{vestedUSD ?? "0"} $USD</p>
            </div>

            <div className="px-4 flex flex-col my-auto">
              <button
                onClick={openModal}
                className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500 font-bold py-2 px-4 rounded text-black"
              >
                VEST LIST
              </button>
              <button
                onClick={collectPendingReward}
                disabled={isCollected}
                className={`${
                  !isCollected
                    ? "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500"
                    : "bg-gray-500"
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
              className="mb-5 bg-yellow-600 hover:bg-yellow-700 font-bold py-4 px-[13em] rounded-xl text-black"
              onClick={showStake}
            >
              ENABLE
            </button>
          </div>

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
                  setIsCollected,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
