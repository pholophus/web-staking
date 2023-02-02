import React, { useState } from "react";
import { closeX } from "../../svg";

const Modal = ({ setShowModal }: any) => {
  const [stake, setStake] = useState({
    option: "block",
    detail: "hidden",
  });
  const [balance, setBalance] = useState(0.56465489);
  const [inputValue, setInputValue] = useState<any>("");

  const onStakeClicked = () => {
    setStake({
      option: "hidden",
      detail: "block",
    });
  };

  const onCancelStake = () => {
    setStake({
      option: "block",
      detail: "hidden",
    });
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const onClickMax = () => {
    setInputValue(balance);
  };


  return (
    <div className="text-white">
      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>

        <div className="bg-gray-600 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className={stake.option}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="">
                <div className="text-center ml-4">
                  <h3 className="text-lg leading-6 font-medium my-4">
                    Your $Oasis Staked:
                    <span> 10,000</span>
                  </h3>
                  <div className="mt-2">
                    <div className="mt-8 px-20 flex justify-between">
                      <button
                        onClick={onStakeClicked}
                        className="bg-green-600 w-[120px] py-2 rounded-lg font-medium"
                      >
                        STAKE
                      </button>
                      <button className="bg-red-600 w-[120px] py-2 rounded-lg font-medium">
                        UNSTAKE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={stake.detail}>
            <div className="p-6 pb-4">
              <div className="">
                <div className="text-center">
                  <div className="flex justify-between">
                    <h3 className="text-lg leading-6 font-medium border-b border-white  ml-4">
                      STAKE OASIS
                    </h3>
                    <button onClick={onCancelStake}>{closeX}</button>
                  </div>
                  <div className="flex justify-between px-8 my-4 border border-white rounded-xl">
                    <div className="my-6">
                      <p className="font-medium text-left">Stake:</p>
                      <input
                        type="text"
                        className="bg-transparent w-30"
                        placeholder="0"
                        value={inputValue}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="my-6">
                      <p className="leading-5 font-medium">
                        Balance: <span>{balance}</span>{" "}
                      </p>
                      <div className="text-right">
                        <button onClick={onClickMax} className="text-sm">
                          MAX
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="bg-yellow-400 rounded-xl px-20 py-2 text-center text-black font-medium">
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4 text-right">
            <button
              className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
