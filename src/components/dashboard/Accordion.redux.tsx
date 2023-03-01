import listSCJson from "../../data/oasis-smart-contract.json";
import { useEffect, useState } from "react";
import {
  claimReward,
  collectReward,
  approve,
} from "../../services/stakingServices";
import { active, inactive } from "../../variable";
import countdown from "../../images/countdown.png";
import { useAppDispatch, useAppSelector } from "../../Redux/Hook";
import { STAKING, stakingAction, USD_CONVERTER } from "../../Redux/Action";
import {
  getPendingOasis,
  getPendingVested,
  getSelectedIndex,
  getApprovalCheck,
  getListVested,
  getMaxCap,
  getVisible,
  getoasisUSD,
  getvestedUSD,
  getshowModal,
  getmodalIndex,
} from "../../Redux/Selector";
import ModalRedux from "./Modal.redux";
import StakeInputRedux from "./StakeInput.redux";

const Accordion = ({ sc, index, stakeProcess }: any) => {
  const dispatch = useAppDispatch();
  const state = {
    pendingOasis: useAppSelector(getPendingOasis),
    pendingVested: useAppSelector(getPendingVested),
    selectedIndex: useAppSelector(getSelectedIndex),
    approvalCheck: useAppSelector(getApprovalCheck),
    listVested: useAppSelector(getListVested),
    maxCap: useAppSelector(getMaxCap),
    visible: useAppSelector(getVisible),
    oasisUSD: useAppSelector(getoasisUSD),
    vestedUSD: useAppSelector(getvestedUSD),
    showModal: useAppSelector(getshowModal),
    modalIndex: useAppSelector(getmodalIndex),
  };

  const [isClaimActive, setIsClaimActive] = useState(false);
  const [isCollectActive, setIsCollectActive] = useState(false);
  const [vestIndex, setVestIndex] = useState(0);

  const claimPendingReward = () => {
    claimReward(sc);
  };

  const collectPendingReward = () => {
    collectReward(sc);
    // setVestIndex(vestIndex + 1)
  };

  const showStake = async () => {
    if (!state.approvalCheck[index]) {
      await approve(sc);
    }
  };

  const openModal = async () => {
    if (state.listVested[index]) {
      dispatch(stakingAction(STAKING.SHOW_MODAL, index));
    } else {
      dispatch(stakingAction(STAKING.HIDE_MODAL, index));
    }
  };

  const vestCollectStatus = () => {
    if (state.listVested[index]) {
      return (
        state.listVested[index] &&
        state.listVested[index].length > 0 &&
        state.listVested[index][vestIndex].collected === false
      );
    }
  };

  const checkClickable = (type: string) => {
    switch (type) {
      case "claim":
        if (state.pendingOasis[index])
          setIsClaimActive(
            state.pendingOasis[index] === "0.00" ||
              state.pendingOasis[index] === "0"
          );
        break;
      case "collect":
        setIsCollectActive(!vestCollectStatus());
        break;
      default:
        break;
    }
  };

  const findIndexByNotCollectedYet = () => {
    return (
      state.listVested[index] &&
      state.listVested[index]?.findIndex((item: any) =>
        state.listVested[index] && state.listVested[index]
          ? !item.collected
          : ""
      )
    );
  };

  useEffect(() => {
    dispatch(USD_CONVERTER());

    checkClickable("claim");
    checkClickable("collect");

    findIndexByNotCollectedYet();
    const index = findIndexByNotCollectedYet();
    if (index !== undefined) {
      setVestIndex(0);
    }
  }, [
    state.approvalCheck[index],
    state.pendingOasis[index],
    state.pendingVested[index],
    state.listVested[index],
    isClaimActive,
  ]);

  return (
    <div
      className={`${
        state.visible && state.selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#171616] text-white rounded-b-xl border-t border-[#3A3A3A]`}
      style={{
        transform: state.visible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div className="flex text-white mx-4 my-10">
        <div className="mr-3 pr-2 my-auto text-left text-[13px]">
          <p className="mb-4">{`Deposit Lock Duration : ${
            listSCJson[sc.index].days
          } Days`}</p>
          <p className="mb-4">{`Pool Max Cap : ${
            state.maxCap[index] ?? "0"
          } $OASIS`}</p>
        </div>

        <div className="mr-3 border-[#3D3D3D] border-2 w-[220px] rounded-lg py-6 my-auto h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E]">Pending Rewards</p>
            <p className="text-[24px]">{`${
              state.pendingOasis[index] ?? "0.00"
            } $OASIS`}</p>
            <p className="mb-5">{`(${
              state.oasisUSD[index] ?? "0.00"
            } $USD)`}</p>
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
            <p className="text-[24px]">
              {state.pendingVested[index] ?? "0"} $OASIS
            </p>
            <p className="mb-5">{`(${state.vestedUSD[index] ?? "0"} $USD)`}</p>
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
                    {state.listVested[index] &&
                    state.listVested[index].length > 0
                      ? state.listVested[index][vestIndex]?.date
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
            <StakeInputRedux
              {...{
                sc, index, showStake, stakeProcess
              }}
            />
          </div>
        </div>

        <div className={state.approvalCheck[index] ? "block" : "hidden"}>
          {state.showModal && state.modalIndex.includes(index) && (
            <ModalRedux
              {...{
                index, collectPendingReward, isCollectActive,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
