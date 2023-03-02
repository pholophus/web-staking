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
  amountStaked,
  checkApproval,
  vestedList,
  convertUSD,
  poolLimit,
  allowanceAmount,
  userOasisBalance,
  stake, 
  unstake
} from "../../services/stakingServices";
import { ethers } from "ethers";
import listSCJson from "../../data/oasis-smart-contract.json";
import { SC as SCClass } from "../../interface/index";
import Accordion from "./Accordion";
import { show, hide, version } from "../../variable";

const List = ({
  poolStatus,
  poolType,
  showModal,
  setShowModal,
  farm,
  setFarm,
}: any) => {
  const [filteredSC, setFilteredSC] = useState<SCClass[]>([]);
  const [endPool, setEndPool] = useState<any[]>([]);
  const [pendingOasis, setPendingOasis] = useState<any[]>([]);
  const [pendingVested, setPendingVested] = useState<any[]>([]);
  const [APRValue, setAPRValue] = useState<any[]>([]);
  const [totalStake, setTotalStake] = useState<any[]>([]);
  const [percentagePoolValue, setPercentagePoolValue] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<any[]>([]);
  const [stakedAmount, setStakedAmount] = useState<any[]>([]);
  const [approvalCheck, setApprovalCheck] = useState<any[]>([]);
  const [listVested, setListVested] = useState<any[]>([]);
  const [showAccordion, setShowAccordion] = useState(false)
  const [maxCap, setMaxCap] = useState<any[]>([]);
  const [allowance, setAllowance] = useState<any[]>([]);
  const [oasisBalance, setOasisBalance] = useState<any>(0);

  useEffect(() => {
    (async () => {
      await initData();
      await checkIfAccountChanged();
    })();
    
  }, [poolStatus, poolType, farm]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for(const sc of filteredSC){
        await updatePool(sc, sc.index)
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [oasisBalance]);

  const initData = async () => {
    await readSC().then(async (res) => {
      await filterPool(res);
    });
  };

  const checkIfAccountChanged = async () => {
    try {
      const { ethereum } = window;
      await ethereum.on("accountsChanged", async () => {
        initData();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filterPool = async (listSC: SCClass[]) => {

    var filteredFarm: any;

    if (farm) {
      await myFarm(listSC).then((resp) => {
        filteredFarm = resp.filter(
          (item: { type: any }) => item.type === poolType
        );
      });
    }
    switch (poolStatus) {
      case "active":
        await activeSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === poolType
          );
          console.log("sebelum get pool detail")
          await getPoolDetail(filteredResp);
          setFilteredSC(resp);
        });
        break;
      case "inactive":
        await unactiveSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === poolType
          );
          console.log("sebelum get pool detail")
          await getPoolDetail(filteredResp);
          setFilteredSC(resp);
        });
        break;
    }
  };

  const getPoolDetail = async (resp: SCClass[]) => {

    /*reset value*/
    setEndPool([]);
    setAPRValue([]);
    setTotalStake([]);
    setPercentagePoolValue([]);
    setSelectedIndex([]);
    setApprovalCheck([]);
    setListVested([]);
    setMaxCap([]);
    setAllowance([]);

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
      await amountStaked(sc).then((resp) => {
        setStakedAmount((stakedAmount) => [...stakedAmount, resp]);
      });
      await checkApproval(sc).then((resp) => {
        setApprovalCheck((approvalCheck) => [...approvalCheck, resp]);
      });
      await vestedList(sc).then((resp) => {
        setListVested((listVested) => [...listVested, resp]);
      });
      await poolLimit(sc).then((resp) => {
        setMaxCap((maxCap) => [...maxCap, resp]);
      })
      await allowanceAmount(sc).then((resp)=> {
        setAllowance((allowance) => [...allowance, resp])
      })
      await userOasisBalance(sc).then((resp) => {
        setOasisBalance(resp)
      })
    }
  };

  const updatePool = async(sc: SCClass, index: number) => {
    
    const [amountStake, oasisBalance, valueAPR, totalStakeValue, percentagePoolLatest] = await Promise.all([
      amountStaked(sc),
      userOasisBalance(sc),
      APR(sc),
      totalStakePool(sc),
      percentagePool(sc)
    ]);
  
    setStakedAmount(prev => {
      const updated = [...prev];
      updated[index] = amountStake;
      return updated;
    });
  
    setOasisBalance(oasisBalance);
  
    setAPRValue(prev => {
      const updated = [...prev];
      updated[index] = valueAPR;
      return updated;
    });
  
    setTotalStake(prev => {
      const updated = [...prev];
      updated[index] = totalStakeValue;
      return updated;
    });
  
    setPercentagePoolValue(prev => {
      const updated = [...prev];
      updated[index] = percentagePoolLatest;
      return updated;
    });
  }

  const stakeProcess = async (sc: SCClass, inputValue: any, process: string, index: number) => {

    switch (process) {
      case "Stake":
        await stake(sc, inputValue);
        break;
      case "Unstake":
        await unstake(sc, inputValue);
        break;
    }

    await updatePool(sc, sc.index)
  };

  return (
    <>
      <div className="flex flex-col baloo mb-20">
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
                setShowAccordion(true)
              }}
            >
              <div className="overflow-x-auto text-white">
                <div className="w-full inline-block align-middle">
                  <div
                    className={`${
                      visible && selectedIndex.includes(index)
                        ? "mt-[0.5rem]"
                        : "my-[0.5rem]"
                    } overflow-hidden `}
                  >
                    <table
                      className={`min-w-full divide-y divide-gray-50 bg-[#171616] h-[100px] ${
                        visible && selectedIndex.includes(index)
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
                                poolType == "single"
                                  ? "Oasis Coins"
                                  : "Oasis - BNB"
                              }`}
                            </div>
                            <div className="flex ">
                              {`${listSCJson[sc.index].days} Days ${
                                poolType == "single" ? "Single staking" : "LP"
                              }`}
                            </div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">Ends</p>
                            </div>
                            <div className="flex">{endPool[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">APR</p>
                            </div>
                            <div className="flex">{APRValue[index]}</div>
                          </td>
                          <td className="py-4 text-sm text-[#ffffff] whitespace-nowrap">
                            <div className="flex">
                              <p className="text-[#8E8E8E]">
                                Total Volume Staked
                              </p>
                            </div>
                            <div className="flex">${totalStake[index]}</div>
                          </td>
                          <td className="pr-[5rem] py-4 text-sm  text-[#ffffff] whitespace-nowrap">
                            <div className="flex justify-between">
                              <div className="flex">
                                <p className="text-[#8E8E8E]">Total Staked</p>
                              </div>
                              <p className="">{percentagePoolValue[index]}%</p>
                            </div>
                            <div className="flex justify-between mb-1"></div>
                            <div className="w-full bg-[#393939] rounded-full h-2.5 dark:bg-[#393939]">
                              <div
                                className="bg-[#16A34A] h-2.5 rounded-full"
                                style={{
                                  width: `${percentagePoolValue[index]}%`,
                                }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="relative flex">
                              <p className="">Details</p>
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
                listSCJson,
                sc,
                stakedAmount,
                approvalCheck,
                listVested,
                maxCap,
                allowance,
                oasisBalance,
                stakeProcess,
                poolStatus
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default List;
