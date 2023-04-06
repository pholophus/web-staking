import { useState, useRef } from "react";
import { active, closeX, inactive } from "../../variable";
import { Vest } from "../../interface";
import Modal from "react-modal";

Modal.setAppElement("#root");

const customStyles: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Modalapp = ({
  showModal,
  setShowModal,
  index,
  listVested,
  collectVestingReward,
  isCollectActive,
}: any) => {
  const subtitle = useRef<HTMLHeadingElement>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="text-white">
          <div className="w-full">
            <div className="w-full bg-[#242424] rounded-lg overflow-hidden shadow-xl transform transition-all  sm:w-full">
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
                    <div className="text-center lg:ml-4">
                      <h3 className="text-[40px] leading-6 mb-10 lg:mb-5 baloo-bold">
                        Vest List
                      </h3>
                      <div>
                        <div className=" flex justify-between lg:px-12">
                          <p className="baloo-bold text-[#FEAE34] text-lg pl-3 lg:pl-0">
                            Date
                          </p>
                          <p className="baloo-bold text-[#FEAE34] text-lg pl-5 lg:pl-0">
                            Amount
                          </p>
                          <p className="baloo-bold text-[#FEAE34] text-lg pl-3 lg:pl-0">
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
                        <div className="mb-4 mt-8 lg:mt-0">
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

        {/* <button onClick={closeModal}>close</button> */}
      </Modal>
    </div>
  );
};
export default Modalapp;
