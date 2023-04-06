import { invariant } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Vest } from "../../interface";
import {
  claimPending,
  collectVesting,
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
  listSCJson,
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
  setStakedAmountUSD
}: any) => {
  // const [oasisUSD, setOasisUSD] = useState<any>("");
  const [vestedUSD, setVestedUSD] = useState<any>("");
  const [stakeUSD, setStakeUSD] = useState<any>("");
  const [isClaimActive, setIsClaimActive] = useState(false);
  const [isCollectActive, setIsCollectActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vestIndex, setVestIndex] = useState(0);

  useEffect(() => {
    checkClickable("claim");
    checkClickable("collect");
  }, [
    approvalCheck[index],
    listVested[index],
    isClaimActive,
    isCollectActive
  ]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
          await updateConversion(index)
    }, 10000);
  
      return () => {
        clearInterval(intervalId);
      };
  })

  const updateConversion = async(index: number) => {

    const [updatePendingVestedUSD, updatePendingOasisUSD] = await Promise.all([
      convertUSD(pendingVested[index]),
      convertUSD(pendingOasis[index])
    ]);

    setPendingVestedUSD(( prev: any) => {
      const updated = [...prev];
      updated[index] = updatePendingVestedUSD;
      return updated;
    });
 
    setPendingOasisUSD(( prev: any) => {
      const updated = [...prev];
      updated[index] = updatePendingOasisUSD;
      return updated;
    });
  }

  const claimPendingReward = () => {
    claimPending(sc);
  };

  const collectVestingReward = () => {
    collectVesting(sc);
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
    const filter = listVested[index]?.findIndex((el: any) => el.collected == "Uncollected")

    if(filter != -1){
      return false;
    }

    return true;
  };

  const indexTime = (vest: any[]) => {

    const fullyLocked = listVested[index]?.every((el: any) => el.collected == "Locked")

    const existUncollect = listVested[index]?.findIndex((el: any) => el.collected == "Uncollected")

    const existLocked = listVested[index]?.findIndex((el: any) => el.collected == "Locked")

    if(fullyLocked){

      return listVested[index]?.[0]?.date

    }else if(existUncollect != -1){

      return "0D:0H:0M"

    }else if(existLocked != -1){

      return listVested[index]?.[existLocked]?.date

    }else{
      return "0D:0H:0M"
    }

  }

  const vestRewardAmount = (vest: any[]) => {

    const fullyLocked = listVested[index]?.every((el: any) => el.collected == "Locked")

    const existUncollect = listVested[index]?.findIndex((el: any) => el.collected == "Uncollected")

    const existLocked = listVested[index]?.findIndex((el: any) => el.collected == "Locked")

    if(fullyLocked){

      let amount = listVested[index]?.[0].amount

      return (parseFloat(amount).toFixed(2))

    }else if(existUncollect != -1){

      return pendingVested[index]

    }else if(existLocked != -1){

      let amount = listVested[index]?.[existLocked].amount

      return (parseFloat(amount).toFixed(2))

    }else{
      return "0.00"
    }

  }

  const vestRewardUSDAmount = (vest: any[]) => {

    const fullyLocked = listVested[index]?.every((el: any) => el.collected == "Locked")

    const existUncollect = listVested[index]?.findIndex((el: any) => el.collected == "Locked")

    const existLocked = listVested[index]?.findIndex((el: any) => el.collected == "Uncollected")

    if(fullyLocked){

      let usdAmount = listVested[index]?.[0].USDAmount

      return (parseFloat(usdAmount).toFixed(2))

    }else if(existUncollect != -1){

      return pendingVestedUSD[index]

    }else if(existLocked != -1){

      let amount = listVested[index]?.[existLocked].USDAmount

      return (parseFloat(amount).toFixed(2))

    }else{
      return "0.00"
    }

  }

  const checkClickable = (type: string) => {
    switch (type) {
      case "claim":
        if (pendingOasis[index])
        setIsClaimActive(
            pendingOasis[index] === "0.00" || pendingOasis[index] === "0"
          );
        break;
      case "collect":
        setIsCollectActive(vestCollectStatus());
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`${
        visible && selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#171616] text-white rounded-b-xl border-t border-[#3A3A3A]`}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="flex text-white mx-4 my-10 flex-col-reverse lg:flex-row gap-5 md:gap-0">

        <div className="mr-3 pr-2 my-auto text-left text-[13px] ">
          <p className="mb-4">{`Deposit Lock Duration : ${
            listSCJson[sc.index].days
          } Days`}</p>
          <p className="mb-4">{`Pool Max Cap : ${
            maxCap[index] ?? "0"
          } $OASIS`}</p>
        </div>
        
        <div className="flex flex-row">
        <div className="mr-3 border-[#3D3D3D] border-2 w-[220px] rounded-lg lg:py-6 my-auto h-[250px] lg:h-[15rem]
        px-2 lg:px-0">
          <div className="mt-5 mb-20 lg:my-5 lg:!pb-3">
            <p className="text-sm lg:text-[20px] text-[#8E8E8E] pb-1">Pending Rewards</p>
            <p className="text-sm lg:text-[24px]">{`${
              pendingOasis[index] ?? "0.00"
            } $OASIS`}</p>
            <p className="mb-5">{`(${pendingOasisUSD[index] ?? "0.00"} $USD)`}</p>
          </div>
          <div className="">
            <button
              disabled={isClaimActive}
              onClick={claimPendingReward}
              className={`${
                isClaimActive ? inactive : active
              } font-bold py-2 px-12 rounded `}
            >
              CLAIM
            </button>
          </div>
        </div>

        <div className="mr-3 border-[#3D3D3D] border-2 w-[290px] rounded-lg lg:py-6 my-auto h-[250px] lg:h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E] hidden lg:block">Available Vest Rewards</p>
            <p className="text-sm text-[#8E8E8E] lg:hidden">Vest Rewards</p>
            <p className="text-sm lg:text-[24px]">
              {
                `
                  ${
                    listVested[index] && listVested[index].length > 0 ? 
                    vestRewardAmount(listVested[index]) : 
                    "0.00"
                  }
                  $OASIS
                `
              } 
             
            </p>
            <p className="mb-5">
              {
                `(
                  ${
                    listVested[index] && listVested[index].length > 0 ? 
                    vestRewardUSDAmount(listVested[index]) : 
                    "0.00"
                  }
                  $USD
                )`
              }
             
            </p>
          </div>

          <div className="px-4 flex flex-col my-auto">
            <div className="px-8 hidden lg:flex justify-start ">
              Next Unlock
            </div>
            <div className="flex flex-col lg:flex-row justify-center gap-3">
              <button
                onClick={openModal}
                className={` font-bold py-2 px-4 rounded border border-[#3D3D3D]`}
              >
                <div className="flex">
                  <img src={countdown} className="scale-[0.8] mr-2" alt="" />
                  <p className="">
                    {
                      `
                        ${
                          listVested[index] && listVested[index].length > 0 ? 
                          indexTime(listVested[index]) : 
                          "0D:0H:0M"
                        }
                      `
                    }
                  </p>
                </div>
              </button>
              <button
                disabled={isCollectActive}
                onClick={collectVestingReward}
                className={` ${
                  isCollectActive ? inactive : active
                }  font-bold py-2 px-4 rounded `}
              >
                COLLECT
              </button>
            </div>
          </div>
        </div>

        </div>




        {/* <div className="hidden lg:flex">

        <div className="mr-3 border-[#3D3D3D] border-2 w-[220px] rounded-lg py-6 my-auto h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E]">Pending Rewards</p>
            <p className="text-[24px]">{`${
              pendingOasis[index] ?? "0.00"
            } $OASIS`}</p>
            <p className="mb-5">{`(${pendingOasisUSD[index] ?? "0.00"} $USD)`}</p>
          </div>
          <div className="">
            <button
              disabled={isClaimActive}
              onClick={claimPendingReward}
              className={`${
                isClaimActive ? inactive : active
              } font-bold py-2 px-12 rounded `}
            >
              CLAIM
            </button>
          </div>
        </div>

        <div className="mr-3 border-[#3D3D3D] border-2 w-[290px] rounded-lg py-6 my-auto h-[15rem]">
          <div className="my-5">
            <p className="text-[20px] text-[#8E8E8E]">Available Vest Rewards</p>
            <p className="text-[24px]">
              {
                `
                  ${
                    listVested[index] && listVested[index].length > 0 ? 
                    vestRewardAmount(listVested[index]) : 
                    "0.00"
                  }
                  $OASIS
                `
              } 
             
            </p>
            <p className="mb-5">
              {
                `(
                  ${
                    listVested[index] && listVested[index].length > 0 ? 
                    vestRewardUSDAmount(listVested[index]) : 
                    "0.00"
                  }
                  $USD
                )`
              }
             
            </p>
          </div>

          <div className="px-4 flex flex-col my-auto">
            <div className="px-8 flex justify-start">
              Next Unlock
            </div>
            <div className="flex justify-center">
              <button
                onClick={openModal}
                className={` font-bold py-2 px-4 rounded border border-[#3D3D3D]`}
              >
                <div className="flex">
                  <img src={countdown} className="scale-[0.8] mr-2" alt="" />
                  <p className="">
                    {
                      `
                        ${
                          listVested[index] && listVested[index].length > 0 ? 
                          indexTime(listVested[index]) : 
                          "0D:0H:0M"
                        }
                      `
                    }
                  </p>
                </div>
              </button>
              <button
                disabled={isCollectActive}
                onClick={collectVestingReward}
                className={` ${
                  isCollectActive ? inactive : active
                }  font-bold py-2 px-4 rounded `}
              >
                COLLECT
              </button>
            </div>
          </div>
        </div>
        </div> */}

        <div className="w-[280px] flex items-center">
          <div>
            <StakeInput
              {...{
                sc,
                stakedAmount,
                index,
                approvalCheck,
                showStake,
                visible,
                selectedIndex,
                allowance,
                oasisBalance,
                stakeProcess,
                poolStatus,
                stakedAmountUSD,
                setStakedAmountUSD
              }}
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
                collectVestingReward,
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
