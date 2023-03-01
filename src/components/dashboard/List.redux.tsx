import { useEffect } from "react";
import listSCJson from "../../data/oasis-smart-contract.json";
import { SC as SCClass } from "../../interface/index";
import AccordionRedux from "./Accordion.redux";
import { show, hide, version } from "../../variable";
import { useAppDispatch, useAppSelector } from "../../Redux/Hook";
import {
  getApprovalCheck,
  getAPRValue,
  getEndPol,
  getFarm,
  getFilteredSC,
  getListSC,
  getListVested,
  getMaxCap,
  getPendingOasis,
  getPendingVested,
  getPercentagePoolValue,
  getPoolStatus,
  getPoolType,
  getSelectedIndex,
  getStakedAmount,
  getTotalStake,
  getVisible,
} from "../../Redux/Selector";
import { activeSC, myFarm, readSC, stake, unactiveSC, unstake } from "../../services";
import { GET_POOL_DETAIL, STAKING, stakingAction } from "../../Redux/Action";

export const ListRedux = () => {
  const state = {
    poolStatus: useAppSelector(getPoolStatus),
    poolType: useAppSelector(getPoolType),
    farm: useAppSelector(getFarm),
    listSC: useAppSelector(getListSC),
    endPool: useAppSelector(getEndPol),
    pendingOasis: useAppSelector(getPendingOasis),
    pendingVested: useAppSelector(getPendingVested),
    APRValue: useAppSelector(getAPRValue),
    totalStake: useAppSelector(getTotalStake),
    percentagePoolValue: useAppSelector(getPercentagePoolValue),
    selectedIndex: useAppSelector(getSelectedIndex),
    stakedAmount: useAppSelector(getStakedAmount),
    approvalCheck: useAppSelector(getApprovalCheck),
    listVested: useAppSelector(getListVested),
    maxCap: useAppSelector(getMaxCap),
    visible: useAppSelector(getVisible),
    filteredSC: useAppSelector(getFilteredSC),
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    initData();
    checkIfAccountChanged();
  }, [state.poolStatus, state.poolType, state.farm]);

  const initData = () => {
    dispatch(stakingAction(STAKING.INIT_DATA));
    readSC().then((res) => {
      filterPool(res);
    });
  };

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      await ethereum.on("accountsChanged", async () => {
        // initData();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filterPool = async (listSC: SCClass[]) => {
    dispatch(stakingAction(STAKING.RESET));

    var filteredFarm: any;

    if (state.farm) {
      myFarm(listSC).then((resp: any) => {
        filteredFarm = resp.filter(
          (item: { type: any }) => item.type === state.poolType
        );
      });
    }
    switch (state.poolStatus) {
      case "active":
        activeSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = state.farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === state.poolType
          );
          getPoolDetail(filteredResp);
          dispatch(GET_POOL_DETAIL(filteredResp));
        });
        break;
      case "inactive":
        unactiveSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = state.farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === state.poolType
          );
          getPoolDetail(filteredResp);
          dispatch(GET_POOL_DETAIL(filteredResp));
        });
        break;
    }
  };

  const getPoolDetail = async (resp: SCClass[]) => {
    dispatch(stakingAction(STAKING.FILTERING_SC, resp));
    for (const sc of resp) {
      dispatch(GET_POOL_DETAIL(sc));
    }
  };

  const stakeProcess = async (
    sc: SCClass,
    inputValue: any,
    process: string,
    index: number
  ) => {
    switch (process) {
      case "Stake":
        await stake(sc, inputValue);
        break;
      case "Unstake":
        await unstake(sc, inputValue);
        break;
    }

    const updatedStakedAmount = [...state.stakedAmount];
    const amountStake = state.stakedAmount;
    updatedStakedAmount[index] = amountStake;
    dispatch(stakingAction(STAKING.UPDATE_STAKED_AMOUNT, updatedStakedAmount));
    // setStakedAmount(updatedStakedAmount);
  };

  return (
    <>
      <div className="flex flex-col baloo mb-20">
        {state.filteredSC.map((sc: any, index: number) => (
          <>
            <button
              className="cursor-default"
              onClick={() => {
                if (state.selectedIndex.includes(index)) {
                  dispatch(stakingAction(STAKING.REMOVE_INDEX, index));
                } else {
                  dispatch(stakingAction(STAKING.ADD_INDEX, index));
                }
              }}
            >
              <div className="overflow-x-auto text-white">
                <div className="w-full inline-block align-middle">
                  <div
                    className={`${
                      state.visible && state.selectedIndex.includes(index)
                        ? "mt-[0.5rem]"
                        : "my-[0.5rem]"
                    } overflow-hidden `}
                  >
                    <table
                      className={`min-w-full divide-y divide-gray-50 bg-[#171616] h-[100px] ${
                        state.visible && state.selectedIndex.includes(index)
                          ? "rounded-t-xl"
                          : "rounded-xl"
                      }`}
                    >
                      <tbody className="divide-y divide-gray-50">
                        <tr key={index}>
                          <td>
                            <img
                              src={version[listSCJson[sc.index].ver - 1]}
                              className="ml-8"
                              alt=""
                            />
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex ">
                              {`${
                                state.poolType == "single"
                                  ? "Oasis Coins"
                                  : "Oasis - BNB"
                              }`}
                            </div>
                            <div className="flex ">
                              {`${listSCJson[index].days} Days ${
                                state.poolType == "single"
                                  ? "Single staking"
                                  : "LP"
                              }`}
                            </div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">Ends</p>
                            </div>
                            <div className="flex">{state.endPool[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">APR</p>
                            </div>
                            <div className="flex">{state.APRValue[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">
                                Total Volume Staked
                              </p>
                            </div>
                            <div className="flex">
                              ${state.totalStake[index]}
                            </div>
                          </td>
                          <td className="pr-[5rem] py-4 text-sm  text-[#ffffff] whitespace-nowrap">
                            <div className="flex justify-between">
                              <div className="flex">
                                <p className="text-[#8E8E8E]">Total Staked</p>
                              </div>
                              <p className="">
                                {state.percentagePoolValue[index]}%
                              </p>
                            </div>
                            <div className="flex justify-between mb-1"></div>
                            <div className="w-full bg-[#393939] rounded-full h-2.5 dark:bg-[#393939]">
                              <div
                                className="bg-[#16A34A] h-2.5 rounded-full"
                                style={{
                                  width: `${state.percentagePoolValue[index]}%`,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="relative flex">
                              <p className="">Details</p>
                              <p className="text-white text-4xl px-6 w-2">
                                {state.visible &&
                                state.selectedIndex.includes(index)
                                  ? hide
                                  : show}
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </button>
            <AccordionRedux sc={sc} index={index} stakeProcess={stakeProcess} />
          </>
        ))}
      </div>
    </>
  );
};
