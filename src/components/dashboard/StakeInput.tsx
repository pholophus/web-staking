import { useEffect, useState } from "react";
import { closeX } from "../../svg";
import { unstake, stake } from "../../services";
import { type } from "@testing-library/user-event/dist/type";

const StakeInput = ({ sc, stakedAmount, index }: any) => {
  const [balance, setBalance] = useState("0");
  const [inputValue, setInputValue] = useState<any>(0);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    setErrorMsg(false);
  };

  const onClickMax = () => {
    setInputValue(balance);
  };

  const onClickStaking = async (e: any) => {
    switch (e.target.value) {
      case "stake":
        if (!inputValue || inputValue == "0") setErrorMsg(true);
        if (inputValue != "0") await stake(sc, inputValue);
        break;
      case "unstake":
        if (!inputValue || inputValue == "0") setErrorMsg(true);
        if (inputValue != "0") await unstake(sc, inputValue);
        break;

      default:
        break;
    }
  };

  const onClickPercentage = (e: any) => {
    setInputValue(e.target.value * Number(balance));
  };

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

  return (
    <div className="neumorphism rounded-lg  transform transition-all max-w-lg w-full text-white mx-auto mb-10">
      <div className="p-6 pb-4">
        <p className="mb-2">
          Your Balance: <span> {stakedAmount[index]} $OASIS</span>{" "}
        </p>
        <div className="flex justify-between">
          <h3 className="text-lg leading-6 font-medium border-b border-white">
            STAKE OASIS
          </h3>
        </div>
        <div className="mt-6 border border-white rounded-xl">
          <div className="flex justify-between px-10 my-8">
            <div className="">
              <p className="font-medium text-left">Stake:</p>
              <input
                type="text"
                className="bg-transparent w-24 border-b"
                placeholder="0"
                value={inputValue}
                onChange={handleInputChange}
              />
              {errorMsg && (
                <p className="text-[12px] text-red-600">Please insert amount</p>
              )}
            </div>
            <div className="w-60">
              <p className="font-medium text-right">
                Balance: <span>{balance}</span>{" "}
              </p>
              <div className="text-right">
                <button onClick={onClickMax} className="text-sm">
                  MAX
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between px-14 mb-4">
            {/* {percentageBtn.map((i) => (
              <button
                onClick={onClickPercentage}
                key={i.value}
                value={i.value}
                className="bg-yellow-500 text-black rounded-lg px-3 py-1"
              >
                {i.label}
              </button>
            ))} */}
          </div>
        </div>

        <div className="mt-8 px-20 flex justify-between">
          <button
            value="stake"
            onClick={onClickStaking}
            className="bg-green-600 w-[120px] py-2 rounded-lg font-medium"
          >
            STAKE
          </button>
          <button
            value="unstake"
            onClick={onClickStaking}
            className="bg-red-600 w-[120px] py-2 rounded-lg font-medium"
          >
            UNSTAKE
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeInput;
