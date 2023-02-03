import React, { useState } from "react";
import { closeX } from "../../svg";

const Modal = ({ setShowModal }: any) => {
  const [stake, setStake] = useState({
    option: "block",
    detail: "hidden",
  });

  return (
    <div className="text-white">
      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>

        <div className="bg-gray-600 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="">
                <div className="text-center ml-4">
                  <h3 className="text-lg leading-6 font-medium my-4">
                    Your $Oasis Staked:
                  </h3>
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
