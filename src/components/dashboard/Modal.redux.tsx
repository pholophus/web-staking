import { active, closeX, inactive } from "../../variable";
import { Vest } from "../../interface";
import { getListVested, getmodalIndex } from "../../Redux/Selector";
import { useAppDispatch, useAppSelector } from "../../Redux/Hook";
import { STAKING, stakingAction } from "../../Redux/Action";

const ModalRedux = ({ index, collectPendingReward, isCollectActive }: any) => {
  const dispatch = useAppDispatch();
  const state = {
    listVested: useAppSelector(getListVested),
    modalIndex: useAppSelector(getmodalIndex),
  };

  const closeModal = () => {
    if (state.modalIndex.includes(index)) {
      dispatch(stakingAction(STAKING.HIDE_MODAL, index));
    }
  };

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
                  <button className="ml-auto" onClick={closeModal}>
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
                    {state.listVested[index] &&
                      state.listVested[index].length > 1 &&
                      state.listVested[index].map((item: Vest, i: number) => (
                        <div className="flex justify-between my-3 px-12 py-[0.5rem] bg-[#2E2E2E]">
                          <p>{item.date}</p>
                          <p>{item.amount}</p>
                          <p>{item.collected ? "collected" : "uncollected"}</p>
                        </div>
                      ))}
                    <div className="mb-4">
                      <button
                        disabled={isCollectActive}
                        onClick={collectPendingReward}
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

export default ModalRedux;