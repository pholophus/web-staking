import React, { useEffect, useState } from "react";
import { closeX } from "../../svg";
import { Vest } from "../../interface";

const Modal = ({
  setShowModal,
  index,
  listVested,
  collectPendingReward,
  setIsCollected,
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
                    {listVested ? (
                      listVested[index].map((item: Vest) => (
                        <div className="flex neumorphism-modal justify-between my-5 py-5 px-2">
                          <p>{item.date ?? "N/A"}</p>
                          <p>{item.amount ?? "N/A"}</p>
                          <button
                            className={`${
                              item.collected
                                ? "bg-gray-500"
                                : "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500"
                            } text-black rounded-lg font-bold py-1 px-2`}
                            disabled={item.collected}
                            onClick={collectPendingReward}
                          >
                            {item.collected ? "COLLECTED" : "COLLECT"}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>Data is not available.</p>
                    )}
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
