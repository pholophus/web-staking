import React, { useState } from "react";

const Modal = ({ setShowModal }: any) => {
  const [stake, setStake] = useState({
    option: "block",
    detail: "hidden",
  });

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

  const closeX = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div>
      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>

        <div
          className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className={stake.option}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="">
                <div className="text-center ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 my-4">
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
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="">
                <div className="text-center">
                  <div className="flex justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 border-b border-black  ml-4">
                      STAKE OASIS
                    </h3>
                    <button onClick={onCancelStake}>{closeX}</button>
                  </div>
                  <div className="flex justify-between px-8 my-4 border border-gray-600 rounded-xl">
                    <div className="my-6">
                      <p className="leading-5">Stake:</p>
                      <p className="leading-5 text-gray-500">0</p>
                    </div>
                    <div className="mt-6">
                      <p className="leading-5">
                        Balance: <span>0</span>{" "}
                      </p>
                      <button className="leading-5 text-sm text-gray-500">
                        MAX
                      </button>
                    </div>
                  </div>
                  <button className="bg-yellow-400 rounded-xl px-20 py-2 text-center">
                    CONFIRM
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
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
