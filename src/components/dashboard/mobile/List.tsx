import React, { useEffect, useState } from "react";
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
  unstake,
} from "../../../services/stakingServices";
import { ethers } from "ethers";
import listSCJson from "../../../data/oasis-smart-contract.json";
import { SC as SCClass } from "../../../interface/index";
import Accordion from "../Accordion";
import { show, hide, version } from "../../../variable";

const ListMobile = ({
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
  const [pendingOasisUSD, setPendingOasisUSD] = useState<any[]>([]);
  const [pendingVested, setPendingVested] = useState<any[]>([]);
  const [pendingVestedUSD, setPendingVestedUSD] = useState<any[]>([]);
  const [APRValue, setAPRValue] = useState<any[]>([]);
  const [totalStake, setTotalStake] = useState<any[]>([]);
  const [percentagePoolValue, setPercentagePoolValue] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<any[]>([]);
  const [stakedAmount, setStakedAmount] = useState<any[]>([]);
  const [stakedAmountUSD, setStakedAmountUSD] = useState<any[]>([]);
  const [approvalCheck, setApprovalCheck] = useState<any[]>([]);
  const [listVested, setListVested] = useState<any[]>([]);
  const [showAccordion, setShowAccordion] = useState(false);
  const [maxCap, setMaxCap] = useState<any[]>([]);
  const [allowance, setAllowance] = useState<any[]>([]);
  const [oasisBalance, setOasisBalance] = useState<any>(0);

  useEffect(() => {
    (async () => {
      await initData();
      await checkIfAccountChanged();
    })();
  }, [poolStatus, poolType, farm]);

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
          await getPoolDetail(filteredResp);
        });
        break;
      case "inactive":
        await unactiveSC(listSC).then(async (resp: SCClass[]) => {
          const farmCheck = farm ? filteredFarm : resp;
          const filteredResp = farmCheck.filter(
            (item: any) => item.type === poolType
          );
          await getPoolDetail(filteredResp);
        });
        break;
    }
  };

  const getPoolDetail = async (resp: SCClass[]) => {
    setFilteredSC(resp);

    /*reset value*/
    setEndPool([]);
    setAPRValue([]);
    setTotalStake([]);
    setPercentagePoolValue([]);
    setPendingOasis([]);
    setPendingVested([]);
    setStakedAmount([]);
    setApprovalCheck([]);
    setListVested([]);
    setMaxCap([]);
    setAllowance([]);
    setSelectedIndex([]);
    setPendingOasisUSD([]);
    setPendingVestedUSD([]);
    setStakedAmountUSD([]);

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

      await pendingAmount(sc).then(async (resp) => {
        setPendingOasis((pendingOasis) => [...pendingOasis, resp]);
        await convertUSD(resp).then((usd) => {
          setPendingOasisUSD((pendingOasisUSD) => [...pendingOasisUSD, usd]);
        });
      });
      await vestedBalance(sc).then(async (resp) => {
        setPendingVested((pendingVested) => [
          ...pendingVested,
          resp?.totalAmount,
        ]);
        setPendingVestedUSD((pendingVestedUSD) => [
          ...pendingVestedUSD,
          resp?.totalUSDAmount,
        ]);
      });
      await amountStaked(sc).then(async (resp) => {
        setStakedAmount((stakedAmount) => [...stakedAmount, resp]);
        await convertUSD(resp).then((usd) => {
          setStakedAmountUSD((stakedAmountUSD) => [...stakedAmountUSD, usd]);
        });
      });
      await checkApproval(sc).then((resp) => {
        setApprovalCheck((approvalCheck) => [...approvalCheck, resp]);
      });
      await vestedList(sc).then((resp) => {
        setListVested((listVested) => [...listVested, resp]);
      });
      await poolLimit(sc).then((resp) => {
        setMaxCap((maxCap) => [...maxCap, resp]);
      });
      await allowanceAmount(sc).then((resp) => {
        setAllowance((allowance) => [...allowance, resp]);
      });
      await userOasisBalance(sc).then((resp) => {
        setOasisBalance(resp);
      });
    }
  };

  const updatePool = async (sc: SCClass, index: number) => {
    const [
      amountStake,
      oasisBalance,
      valueAPR,
      totalStakeValue,
      percentagePoolLatest,
      pendingOasis,
      pendingVested,
    ] = await Promise.all([
      amountStaked(sc),
      userOasisBalance(sc),
      APR(sc),
      totalStakePool(sc),
      percentagePool(sc),
      pendingAmount(sc),
      vestedBalance(sc),
    ]);

    setStakedAmount((prev) => {
      const updated = [...prev];
      updated[index] = amountStake;
      return updated;
    });

    setOasisBalance(oasisBalance);

    setAPRValue((prev) => {
      const updated = [...prev];
      updated[index] = valueAPR;
      return updated;
    });

    setTotalStake((prev) => {
      const updated = [...prev];
      updated[index] = totalStakeValue;
      return updated;
    });

    setPercentagePoolValue((prev) => {
      const updated = [...prev];
      updated[index] = percentagePoolLatest;
      return updated;
    });

    setPendingOasis((prev) => {
      const updated = [...prev];
      updated[index] = pendingOasis;
      return updated;
    });

    setPendingVested((prev) => {
      const updated = [...prev];
      updated[index] = pendingVested?.totalAmount;
      return updated;
    });
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

    await updatePool(sc, sc.index);
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
                setShowAccordion(true);
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
                    <div
                      className={`min-w-full divide-y divide-gray-50 bg-[#171616]  ${
                        visible && selectedIndex.includes(index)
                          ? "rounded-t-xl"
                          : "rounded-xl"
                      }`}
                    >
                      <div className="flex flex-col pt-2 mx-4">
                        <div className="flex flex-col gap-3 items-center">
                          <div className="flex w-full gap-5 items-center">
                            <img
                              src={version[listSCJson[sc.index].ver - 1]}
                              className=""
                              alt=""
                            />

                            <div className="">
                              <div className="flex flex-col items-start">
                                {`${
                                  poolType == "single"
                                    ? "Oasis Coins"
                                    : "Oasis - BNB"
                                }`}
                              </div>
                              <div className="flex flex-col items-center">
                                {`${listSCJson[sc.index].days} Days ${
                                  poolType == "single" ? "Single staking" : "LP"
                                }`}
                              </div>
                            </div>
                            <p className="text-white text-4xl px-6 w-2">
                                {visible && selectedIndex.includes(index)
                                  ? hide
                                  : show}
                              </p>
                          </div>
                          <div className="flex flex-row gap-4 w-full">
                            <div className="flex flex-col w-full gap-0 text-left">
                              <div className="">
                                <p className="text-[#8E8E8E]">Ends</p>
                              </div>
                              <div className="">{endPool[index]}</div>
                            </div>
                            <div className="flex flex-col w-full gap-0 text-left">
                              <div className="">
                                <p className="text-[#8E8E8E]">APR</p>
                              </div>
                              <div className="">{APRValue[index]}%</div>
                            </div>
                            <div className="flex flex-col w-[450px] gap-0 text-left">
                              <div className="">
                                <p className="text-[#8E8E8E]"> Volume Staked</p>
                              </div>
                              <div className="">${totalStake[index]}</div>
                            </div>
                          </div>

                          <div className="flex flex-col w-full  items-center mb-6">
                          <div className="flex justify-between w-full">
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
                        </div>


                        </div>
                      </div>
                    </div>                    
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
                poolStatus,
                pendingOasisUSD,
                setPendingOasisUSD,
                pendingVestedUSD,
                setPendingVestedUSD,
                stakedAmountUSD,
                setStakedAmountUSD,
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default ListMobile;
