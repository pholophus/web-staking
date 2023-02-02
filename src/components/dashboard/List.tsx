import React, { useEffect, useState } from "react";
import MetaBtn from "../metamask/metamask-btn";
import {
  readSC,
  activeSC,
  unactiveSC,
  myFarm,
  poolEndTime,
  APR,
  totalStakePool,
  percentagePool,
  pendingAmount,
  vestedBalance,
} from "../../services";
import { ethers } from "ethers";
import listSCJson from "../../data/oasis-smart-contract.json";
import { SC as SCClass } from "../../interface/index";
import Accordion from "./Accordion";
import { show, hide } from "../../svg";

const List = ({ poolStatus, poolType, showModal, setShowModal }: any) => {
  const [listSC, setListSC] = useState<SCClass[]>([]);
  const [filteredSC, setFilteredSC] = useState<SCClass[]>([]);
  const [endPool, setEndPool] = useState<any[]>([]);
  const [pendingOasis, setPendingOasis] = useState<any[]>([]);
  const [pendingVested, setPendingVested] = useState<any[]>([]);
  const [APRValue, setAPRValue] = useState<any[]>([]);
  const [totalStake, setTotalStake] = useState<any[]>([]);
  const [percentagePoolValue, setPercentagePoolValue] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<any[]>([]);



  useEffect(() => {
    readSC().then((res) => {
      setListSC(res);
      filterPool(res);
    });
  }, [poolStatus, poolType]);

  const filterPool = async (listSC: SCClass[]) => {
    /*reset value*/
    setEndPool([]);
    setAPRValue([]);
    setTotalStake([]);
    setPercentagePoolValue([]);
    setSelectedIndex([]);

    switch (poolStatus) {
      case "active":
        activeSC(listSC).then(async (resp: SCClass[]) => {
          const filteredResp = resp.filter((item) => item.type === poolType);
          getPoolDetail(filteredResp);
        });
        break;
      case "inactive":
        unactiveSC(listSC).then(async (resp: SCClass[]) => {
          const filteredResp = resp.filter((item) => item.type === poolType);
          getPoolDetail(filteredResp);
        });
        break;
      case "myFarm":
        myFarm(listSC).then((resp) => {
          const filteredResp = resp.filter(
            (item: { type: any }) => item.type === poolType
          );
          getPoolDetail(filteredResp);
        });
        break;
    }
  };

  const getPoolDetail = async (resp: SCClass[]) => {
    setFilteredSC(resp);
    console.log(resp);

    for (const sc of resp) {
      await poolEndTime(sc).then((resp) => {
        setEndPool((endPool) => [...endPool, resp]);
      });

      await APR(sc).then((resp) => {
        setAPRValue((APRValue) => [...APRValue, resp]);
      });

      await totalStakePool(sc).then((resp) => {
        setTotalStake((totalStake) => [...totalStake, resp]);
      });

      await percentagePool(sc).then((resp) => {
        setPercentagePoolValue((percentagePoolValue) => [
          ...percentagePoolValue,
          resp,
        ]);
      });
      await pendingAmount(sc).then((resp) => {
        setPendingOasis((pendingOasis) => [...pendingOasis, resp]);
      });
      await vestedBalance(sc).then((resp) => {
        setPendingVested((pendingVested) => [...pendingVested, resp]);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        {filteredSC.map((sc, index) => (
          <>
            <button
              className="cursor-default"
              onClick={() => {
                if (selectedIndex.includes(index)) {
                  setSelectedIndex(
                    selectedIndex.filter((item) => item !== index)
                  );
                } else {
                  setSelectedIndex((selectedIndex) => [
                    ...selectedIndex,
                    index,
                  ]);
                }
              }}
            >
              <div className="overflow-x-auto">
                <div className="w-full inline-block align-middle">
                  <div className={`border-b border-gray-700 overflow-hidden `}>
                    <table className="min-w-full divide-y divide-gray-50 bg-[#212121]">
                      <tbody className="divide-y divide-gray-50">
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              OASIS {listSCJson[sc.index].days} Days
                            </div>
                            <div className="flex">
                              V {listSCJson[sc.index].ver}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="">End</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                />
                              </svg>
                            </div>
                            <div className="flex">{endPool[index]}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="">APR</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                />
                              </svg>
                            </div>
                            <div className="flex">{APRValue[index]}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="">Total Staked</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                />
                              </svg>
                            </div>
                            <div className="flex">${totalStake[index]}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="">{percentagePoolValue[index]}%</p>
                            </div>
                          </td>
                          <td>
                            <div className="relative">
                              <p className="text-white text-4xl px-6 w-2">
                                {visible && selectedIndex.includes(index)
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
            <Accordion
              {...{
                pendingVested,
                pendingOasis,
                visible,
                index,
                selectedIndex,
                showModal,
                setShowModal,
                sc
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default List;
