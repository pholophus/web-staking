import { useState } from "react";
import { closeX } from "../../svg";

const StakeInput = () => {
  const [balance, setBalance] = useState(10000);
  const [inputValue, setInputValue] = useState<any>("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const onClickMax = () => {
    setInputValue(balance);
  };

  const onClickPercentage = (e: any) => {
    setInputValue(e.target.value * balance);
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
          <button className="bg-green-600 w-[120px] py-2 rounded-lg font-medium">
            STAKE
          </button>
          <button className="bg-red-600 w-[120px] py-2 rounded-lg font-medium">
            UNSTAKE
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeInput;
