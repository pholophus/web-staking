import React, { useEffect, useState } from "react";
import { active, closeX } from "../../svg";
import { Vest } from "../../interface";

const Modal = ({
  setShowModal,
  index,
  listVested,
  collectPendingReward,
}: any) => {
  return (
    <div className="text-white">
      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>

        <div className="bg-[#2a3d55] rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="">
                <div className="text-center ml-4">
                  <h3 className="text-lg leading-6 font-medium my-5">
                    VEST LIST:
                  </h3>
                  <div>
                    <div className=" flex justify-between font-medium">
                      <p className=" border-b">DATE</p>
                      <p className=" border-b">AMOUNT</p>
                      <p className=" border-b">STATUS</p>
                    </div>
                    {listVested[index].map((item: Vest, i: number) => (
                      <div className="flex neumorphism-modal justify-between my-5 py-5 px-2">
                        <p>{item.date}</p>
                        <p>{item.amount}</p>
                        <p>{item.collected ? "COLLECTED" : "COLLECT"}</p>
                      </div>
                    ))}
                    <div>
                      <button
                        onClick={collectPendingReward}
                        className={`${active} font-bold py-2 px-4 mt-4 rounded text-black`}
                      >
                        COLLECT ALL
                      </button>
                    </div>
                  </div>
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
