import { useState } from "react";
import Modal from "./Modal";
import { link } from "../../svg";

const Accordion = ({
  visible,
  index,
  selectedIndex,
  pendingOasis,
  pendingVested,
  setShowModal,
}: any) => {
  return (
    <div
      className={`${
        visible && selectedIndex.includes(index)
          ? "block top-0 transition duration-500 ease-in-out transform"
          : "hidden"
      } py-1 bg-[#383737] `}
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <div className="text-white my-7 flex justify-between px-10">
        <div className="flex neumorphism rounded-lg py-10">
          <div className="pr-10 pl-2">
            <p className="text-left">PENDING REWARDS:</p>
            <p className="text-left">{pendingOasis[index]} $OASIS</p>
          </div>
          <div className="pl-20 pr-6">
            <button className="bg-yellow-600 hover:bg-yellow-700 font-bold py-2 px-4 rounded text-black">
              CLAIM
            </button>
          </div>
        </div>
        <div className="flex neumorphism rounded-lg py-10">
          <div className="pr-10 pl-2">
            <p className="text-left">VESTED REWARDS:</p>
            <p className="text-left">{pendingVested[index]} $OASIS</p>
          </div>
          <div className="pl-20 pr-6">
            <button className="bg-yellow-600 hover:bg-yellow-700 font-bold py-2 px-4 rounded text-black">
              COLLECT
            </button>
          </div>
        </div>
        <div className="my-auto">
          <a href="/" className="flex">
            {link}
            <p>View Token Contract</p>
          </a>
          <a href="/" className="flex">
            {link}
            <p>View Pool Contract</p>
          </a>
        </div>
      </div>
      <button
        className="my-5 bg-yellow-600 hover:bg-yellow-700 font-bold py-4 px-64 rounded-xl text-black"
        onClick={() => setShowModal(true)}
      >
        ENABLE
      </button>
    </div>
  );
};

export default Accordion;
