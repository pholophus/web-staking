import { ACTION } from "../Action";
import { initialStakingState } from "../State";

export const stakingReducer = (state = initialStakingState, action: any) => {
  switch (action.type) {
    case ACTION.GET_DETAIL:
      return {
        ...state,
        endPool: [...state.endPool, action.payload.endPool],
        APRValue: [...state.APRValue, action.payload.APRValue],
        totalStake: [...state.totalStake, action.payload.totalStake],
        percentagePoolValue: [
          ...state.percentagePoolValue,
          action.payload.percentagePoolValue,
        ],
        pendingOasis: [...state.pendingOasis, action.payload.pendingOasis],
        pendingVested: [...state.pendingVested, action.payload.pendingVested],
        stakedAmount: [...state.stakedAmount, action.payload.stakedAmount],
        approvalCheck: [...state.approvalCheck, action.payload.approvalCheck],
        listVested: [...state.listVested, action.payload.listVested],
        maxCap: [...state.maxCap, action.payload.maxCap],
      };
    case ACTION.RESET:
      return {
        ...state,
        endPool: [],
        APRValue: [],
        totalStake: [],
        percentagePoolValue: [],
        selectedIndex: [],
        approvalCheck: [],
      };
    case ACTION.INIT_DATA:
      return {
        ...state,
        listSC: action.payload,
      };
    case ACTION.REMOVE_INDEX:
      return {
        ...state,
        selectedIndex: state.selectedIndex.filter(
          (item: any) => item !== action.payload
        ),
      };
    case ACTION.ADD_INDEX:
      return {
        ...state,
        selectedIndex: [...state.selectedIndex, action.payload],
      };
    case ACTION.SHOW_ACCORDION:
      return {
        ...state,
        showAccordion: true,
      };
    case ACTION.TOGGLE_FARM:
      return {
        ...state,
        farm: !state.farm,
      };
    case ACTION.FILTERING_SC:
      return {
        ...state,
        filteredSC: action.payload,
      };
    case ACTION.SET_POOL_STATUS:
      return {
        ...state,
        poolStatus: action.payload,
      };
    case ACTION.SET_POOL_TYPE:
      return {
        ...state,
        poolType: action.payload,
      };

    default:
      return state;
  }
};
