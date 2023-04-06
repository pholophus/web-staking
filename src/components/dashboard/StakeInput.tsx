import { useEffect, useReducer, useState } from "react";
import { active, inactive, stakeBg, unstakeBg } from "../../variable";
import coin from "../../images/coin.png";
import {convertUSD} from "../../services/stakingServices"

const StakeInput = ({
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
}: any) => {
  const INITIAL_STATE = {
    stake: "",
    color: "",
  };

  useEffect(() => {

    const intervalId = setInterval(async () => {
      await updateConversion(index)
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
    
  });

  const updateConversion = async(index: number) => {

    const convertAmount = selectStake?.stake === "Stake" ? oasisBalance : stakedAmount[index]

    const [updateStakedAmountUSD] = await Promise.all([
      convertUSD(convertAmount),
    ]);

    setStakedAmountUSD(( prev: any) => {
      const updated = [...prev];
      updated[index] = updateStakedAmountUSD;
      return updated;
    });
  }

  const postReducer = (state: any, action: any) => {
    switch (action.type) {
      case "SELECT_STAKE":
        return {
          stake: "Stake",
          color: stakeBg,
        };
      case "SELECT_UNSTAKE":
        return {
          stake: "Unstake",
          color: unstakeBg,
        };
    }
  };

  const [selectStake, dispatch] = useReducer(postReducer, INITIAL_STATE);

  //#region
  const [inputValue, setInputValue] = useState<any>(0);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [currentOasisBalance, setCurrentOasisBalance] = useState(0)
  const [oasisUSD, setOasisUSD] = useState<any>(0)

  const approved = approvalCheck[index] ? "block" : "hidden";
  const notApproved = approvalCheck[index] ? "hidden" : "block";

  const percentageBtn = [
    {
      value: 0.25,
      label: "25%",
    },
    {
      value: 0.5,
      label: "50%",
    },
    {
      value: 0.75,
      label: "75%",
    },
    {
      value: 1,
      label: "100%",
    },
  ];

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    setShowErrorMsg(false);
  };

  const onClickStaking = async (e: any) => {

    const oasisValue = e.target.value == "Stake" ? Number(oasisBalance) : Number(stakedAmount[index])

    setCurrentOasisBalance(oasisValue)

    if (!inputValue || inputValue == "0.00") {
      setShowErrorMsg(true);
      setErrorMsg("Please insert amount");
    } else if (Number(inputValue) > oasisValue) {
      setShowErrorMsg(true);
      setErrorMsg("Insufficient balance");
    } else {
      stakeProcess(sc, inputValue, e.target.value, index)
    }
  };

  useEffect(() => {
  }, [stakedAmount[index]]);

  const onClickPercentage = (e: any) => {
    setShowErrorMsg(false);
    const value = e.target.value;
    const balance = selectStake?.stake === "Stake" ? oasisBalance : stakedAmount[index];
    const stakeAmount =  value * balance
    setInputValue(stakeAmount.toString());
  };

  const stakeInput = (e: any) => {
    switch (e.target.value) {
      case "stake":
        setShowInput(true);
        dispatch({ type: "SELECT_STAKE" });
        break;
      case "unstake":
        setShowInput(true);
        dispatch({ type: "SELECT_UNSTAKE" });
        break;
    }
  };

  return (
    <>
      <div className={`mx-auto ${notApproved}`}>
        <div className="flex items-center place-content-center mr-8 border-[#3D3D3D] border-2 w-[330px] rounded-lg py-6 my-auto lg:h-[15rem]">
          <div className="my-auto">
            <p className="text-[20px] text-[#8E8E8E] mb-5">
              Your $Oasis Staked
            </p>
            <button
              className={`${active} font-bold py-2 px-28 rounded-md `}
              onClick={showStake}
            >
              Enable
            </button>
          </div>
        </div>
      </div>

      {!showInput && 
      (
        <div className={`mx-auto ${approved}`}>
          <div className="items-center place-content-center mr-8 border-[#3D3D3D] border-2 w-[330px] rounded-lg py-6 my-auto h-[15rem]">
            <div className="my-5">
              <p className="text-[20px] text-[#8E8E8E]">Your $Oasis Staked</p>
              <p className="text-[24px]">{`${stakedAmount[index]} $OASIS`}</p>
              <p className="mb-5">{`(${stakedAmountUSD[index] ?? "0.00"} $USD)`}</p>
            </div>
            <div className="mt-4 px-8 flex justify-between">
              <button
                value="stake"
                onClick={stakeInput}
                className={
                  `
                  ${
                      process.env.REACT_APP_DEBUG_MODE == "true" ?
                      stakeBg 
                    :
                      (process.env.REACT_APP_DEBUG_MODE == "false" && poolStatus == "active" && oasisBalance > 0) ? 
                      stakeBg
                    :  
                      inactive
                  } 
                  w-[120px] py-2 rounded-md`
                }
                disabled={
                  process.env.REACT_APP_DEBUG_MODE == "true" ? 
                    false : 
                    true
                    &&
                    oasisBalance <= 0 
                  }
              >
                Stake
              </button>

              <button
                value="unstake"
                onClick={stakeInput}
                className={`
                  ${
                    process.env.REACT_APP_DEBUG_MODE == "true" ?
                    unstakeBg 
                    :
                    (process.env.REACT_APP_DEBUG_MODE == "false" && poolStatus == "inactive" && stakedAmount[index] > 0) ? 
                      unstakeBg
                    :  
                      inactive 
                  } 
                  w-[120px] py-2 rounded-md`
                }
                disabled={
                  process.env.REACT_APP_DEBUG_MODE == "true" ? 
                      false : 
                      true
                    &&
                    stakedAmount[index] <= 0 
                }
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      )}


      {showInput && (
        <div className={`mx-auto ${approved}`}>
          <div className="items-center place-content-center mr-8 border-[#3D3D3D] border-2 w-[330px] rounded-lg py-6 my-auto h-[15rem]">
            <div className="">
              <p className="text-[20px] text-[#8E8E8E]">Stake your $Oasis</p>
              <div className="bg-[#474747] rounded-lg mx-10 flex mt-3">
                <input
                  type="text"
                  className="bg-transparent rounded-lg py-2 ml-2 focus:outline-none"
                  placeholder="0"
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <img src={coin} className="object-contain mr-4" alt="" />
              </div>

              <div className="flex justify-between mt-1 text-[14px] mx-12">
                {showErrorMsg && (
                  <p className="mr-auto text-red-600">{errorMsg}</p>
                )}
                <p className="ml-auto">{`${selectStake?.stake === "Stake"
                    ? oasisBalance
                    : stakedAmount[index]} $Oasis`}</p>
              </div>

              <div className="flex justify-between px-12 my-1">
                {percentageBtn.map((i) => (
                  <button
                    onClick={onClickPercentage}
                    key={i.value}
                    value={i.value}
                    className={`${selectStake?.color} text-[14px] rounded-md w-[3rem] py-[1px]`}
                  >
                    {i.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between  my-4 mx-12">
                <button
                  value={selectStake?.stake}
                  onClick={onClickStaking}
                  className={`${selectStake?.color} rounded-md py-2 w-[7rem]`}
                >
                  {selectStake?.stake}
                </button>
                <button
                  onClick={() => {setShowInput(!showInput); setShowErrorMsg(false); setInputValue(0)}}
                  className={`${inactive} rounded-md py-2 w-[7rem]`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StakeInput;
