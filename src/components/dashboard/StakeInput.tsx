import { useEffect, useState } from "react";
import { unstake, stake } from "../../services";

const StakeInput = ({ sc, stakedAmount, index }: any) => {
  const [inputValue, setInputValue] = useState<any>(0);
  const [errorMsg, setErrorMsg] = useState(false);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    setErrorMsg(false);
  };

  const onClickMax = () => {
    setInputValue(stakedAmount[index]);
  };

  const onClickStaking = async (e: any) => {
    switch (e.target.value) {
      case "stake":
        if (!inputValue || inputValue == "0.00") setErrorMsg(true);
        if (inputValue != "0") await stake(sc, inputValue);
        break;
      case "unstake":
        if (!inputValue || inputValue == "0.00") setErrorMsg(true);
        if (inputValue != "0") await unstake(sc, inputValue);
        break;

      default:
        break;
    }
  };


  return (
    <div className="neumorphism rounded-lg  transform transition-all max-w-lg w-full text-white mx-auto mb-10">
      <div className="p-6 pb-4">
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
                Balance: <span>{stakedAmount[index]}</span>{" "}
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
