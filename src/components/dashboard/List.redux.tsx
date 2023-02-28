import React, { useEffect, useState } from "react";
import MetaBtn from "../metamask/metamask-btn";
import { ethers } from "ethers";
import listSCJson from "../../data/oasis-smart-contract.json";
import { SC as SCClass } from "../../interface/index";
import Accordion from "./Accordion";
import { show, hide, version } from "../../variable";
import { useAppDispatch, useAppSelector } from "../../Redux/Hook";
import {
  ADD_INDEX,
  FILTERING_SC,
  GET_POOL_DETAIL,
  INIT_DATA,
  REMOVE_INDEX,
  RESET_VALUE,
  SHOW_ACCORDION,
} from "../../Redux/Action";
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
  getShowAccordion,
  getStakedAmount,
  getTotalStake,
  getVisible,
} from "../../Redux/Selector";
import { activeSC, myFarm, readSC, unactiveSC } from "../../services";

export const ListRedux = () => {
  const stake = {
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
    showAccordion: useAppSelector(getShowAccordion),
    visible: useAppSelector(getVisible),
    filteredSC: useAppSelector(getFilteredSC),
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    initData();
    checkIfAccountChanged();
  }, [stake.poolStatus, stake.poolType, stake.farm]);

  const initData = () => {
    dispatch(INIT_DATA());
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
    dispatch(RESET_VALUE());

    var filteredFarm: any;

    if (stake.farm) {
      myFarm(listSC).then((resp: any) => {
        filteredFarm = resp.filter(
          (item: { type: any }) => item.type === stake.poolType
        );
      });
    }
    switch (stake.poolStatus) {
      case "active":
        activeSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = stake.farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === stake.poolType
          );
          getPoolDetail(filteredResp);
          dispatch(GET_POOL_DETAIL(filteredResp));
        });
        break;
      case "inactive":
        unactiveSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = stake.farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === stake.poolType
          );
          getPoolDetail(filteredResp);
          dispatch(GET_POOL_DETAIL(filteredResp));
        });
        break;
    }
  };

  const getPoolDetail = async (resp: SCClass[]) => {
    dispatch(FILTERING_SC(resp));
    for (const sc of resp) {
      dispatch(GET_POOL_DETAIL(sc));
    }
  };

  return (
    <>
      <div className="flex flex-col baloo mb-20">
        {stake.filteredSC.map((sc: any, index: number) => (
          <>
            <button
              className="cursor-default"
              onClick={() => {
                if (stake.selectedIndex.includes(index)) {
                  dispatch(REMOVE_INDEX(index));
                } else {
                  dispatch(ADD_INDEX(index));
                }
                dispatch(SHOW_ACCORDION());
              }}
            >
              <div className="overflow-x-auto text-white">
                <div className="w-full inline-block align-middle">
                  <div
                    className={`${
                      stake.visible && stake.selectedIndex.includes(index)
                        ? "mt-[0.5rem]"
                        : "my-[0.5rem]"
                    } overflow-hidden `}
                  >
                    <table
                      className={`min-w-full divide-y divide-gray-50 bg-[#171616] h-[100px] ${
                        stake.visible && stake.selectedIndex.includes(index)
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
                                stake.poolType == "single"
                                  ? "Oasis Coins"
                                  : "Oasis - BNB"
                              }`}
                            </div>
                            <div className="flex ">
                              {`${listSCJson[sc.index].days} Days ${
                                stake.poolType == "single"
                                  ? "Single staking"
                                  : "LP"
                              }`}
                            </div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">Ends</p>
                            </div>
                            <div className="flex">{stake.endPool[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">APR</p>
                            </div>
                            <div className="flex">{stake.APRValue[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">
                                Total Volume Staked
                              </p>
                            </div>
                            <div className="flex">
                              ${stake.totalStake[index]}
                            </div>
                          </td>
                          <td className="pr-[5rem] py-4 text-sm  text-[#ffffff] whitespace-nowrap">
                            <div className="flex justify-between">
                              <div className="flex">
                                <p className="text-[#8E8E8E]">Total Staked</p>
                              </div>
                              <p className="">
                                {stake.percentagePoolValue[index]}%
                              </p>
                            </div>
                            <div className="flex justify-between mb-1"></div>
                            <div className="w-full bg-[#393939] rounded-full h-2.5 dark:bg-[#393939]">
                              <div
                                className="bg-[#16A34A] h-2.5 rounded-full"
                                style={{
                                  width: `${stake.percentagePoolValue[index]}%`,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="relative flex">
                              <p className="">Details</p>
                              <p className="text-white text-4xl px-6 w-2">
                                {stake.visible &&
                                stake.selectedIndex.includes(index)
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
            {/* <Accordion /> */}
          </>
        ))}
      </div>
    </>
  );
};
