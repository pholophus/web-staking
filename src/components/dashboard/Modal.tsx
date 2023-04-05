import React, { useEffect, useState } from "react";
import { active, closeX, inactive } from "../../variable";
import { Vest } from "../../interface";

const Modal = ({
  setShowModal,
  index,
  listVested,
  collectVestingReward,
  isCollectActive,
}: any) => {
  return (
    <div className="text-white">
      <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-[#0b0b0b] opacity-75"></div>
        </div>

        <div className="bg-[#242424] rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <div className="flex justify-between pb-2">
                  <button
                    className="ml-auto"
                    onClick={() => setShowModal(false)}
                  >
                    {closeX}
                  </button>
                </div>
                <div className="text-center ml-4">
                  <h3 className="text-[40px] leading-6 mb-5 baloo-bold">
                    Vest List
                  </h3>
                  <div>
                    <div className=" flex justify-between px-12">
                      <p className="baloo-bold text-[#FEAE34] text-lg">Date</p>
                      <p className="baloo-bold text-[#FEAE34] text-lg">
                        Amount
                      </p>
                      <p className="baloo-bold text-[#FEAE34] text-lg">
                        Status
                      </p>
                    </div>
                    {listVested[index].map((item: Vest, i: number) => (
                      <div className="py-[0.5rem]">
                        <div className="py-[0.5rem] bg-[#2E2E2E] grid grid-cols-3 gap-y-4">
                          <div> 
                            <p>{item.date}</p>
                          </div>
                          <div>
                            <p>{item.amount}</p>
                          </div>
                          <div>
                            <p>{item.collected}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mb-4">
                      <button
                        disabled={isCollectActive}
                        onClick={collectVestingReward}
                        className={`${
                          isCollectActive ? inactive : active
                        } py-2 px-4 mt-4 rounded-lg w-[10rem]`}
                      >
                        Collect All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
