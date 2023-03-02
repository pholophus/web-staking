import { AWAIT, STAKING } from "../Action";
import { initialStakingState } from "../State";

export const stakingReducer = (state = initialStakingState, action: any) => {
  switch (action.type) {
    case STAKING.GET_DETAIL:
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
        allowance: [...state.allowance, action.payload.allowance],
        oasisBalance: action.payload.oasisBalance,
      };
    case STAKING.RESET:
      return {
        ...state,
        endPool: [],
        APRValue: [],
        totalStake: [],
        percentagePoolValue: [],
        selectedIndex: [],
        approvalCheck: [],
        allowance: [],
      };
    case STAKING.INIT_DATA:
      return {
        ...state,
        listSC: action.payload,
      };
    case STAKING.REMOVE_INDEX:
      return {
        ...state,
        selectedIndex: state.selectedIndex.filter(
          (item: any) => item !== action.payload
        ),
      };
    case STAKING.ADD_INDEX:
      return {
        ...state,
        selectedIndex: [...state.selectedIndex, action.payload],
      };
    case STAKING.TOGGLE_FARM:
      return {
        ...state,
        farm: !state.farm,
      };
    case STAKING.FILTERING_SC:
      return {
        ...state,
        filteredSC: action.payload,
      };
    case STAKING.SET_POOL_STATUS:
      return {
        ...state,
        poolStatus: action.payload,
      };
    case STAKING.SET_POOL_TYPE:
      return {
        ...state,
        poolType: action.payload,
      };
    case STAKING.CONVERT_USD:
      return {
        ...state,
        oasisUSD: action.payload.oasis,
        vestedUSD: action.payload.vest,
        stakeUSD: action.payload.stake,
      };
    case STAKING.SHOW_MODAL:
      return {
        ...state,
        modalIndex: [...state.modalIndex, action.payload],
        showModal: true,
      };
    case STAKING.HIDE_MODAL:
      return {
        ...state,
        modalIndex: state.modalIndex.filter(
          (index: any) => index !== action.payload
        ),
      };
    case STAKING.UPDATE_STAKED_AMOUNT:
      return {
        ...state,
        stakedAmount: action.payload,
      };
    case STAKING.UPDATE_OASIS_BAL:
      return {
        ...state,
        oasisBalance: action.payload,
      };
    case AWAIT.LIST_SC:
      return {
        ...state,
        listSC: [...action.payload],
      };
    case AWAIT.END_POOL:
      return {
        ...state,
        endPool: [...action.payload],
      };
    case AWAIT.PENDING_OASIS:
      return {
        ...state,
        pendingOasis: [...action.payload],
      };
    case AWAIT.PENDING_VESTED:
      return {
        ...state,
        pendingVested: [...action.payload],
      };
    case AWAIT.APR_VALUE:
      return {
        ...state,
        APRValue: [...action.payload],
      };
    case AWAIT.TOTAL_STAKE:
      return {
        ...state,
        totalStake: [...action.payload],
      };
    case AWAIT.PERCENTAGE_POOL_VALUE:
      return {
        ...state,
        percentagePoolValue: [...action.payload],
      };
    case AWAIT.ALLOWANCE:
      return {
        ...state,
        allowance: [...action.payload],
      };
    case AWAIT.OASIS_BALANCE:
      return {
        ...state,
        oasisBalance: [...action.payload],
      };
    case AWAIT.MAX_CAP:
      return {
        ...state,
        maxCap: [...action.payload],
      };
    case AWAIT.LIST_VESTED:
      return {
        ...state,
        listVested: [...action.payload],
      };
    case AWAIT.OASIS_USD:
      return {
        ...state,
        oasisUSD: [...action.payload],
      };
    case AWAIT.VESTED_USD:
      return {
        ...state,
        vestedUSD: [...action.payload],
      };
    case AWAIT.STAKE_USD:
      return {
        ...state,
        stakeUSD: [...action.payload],
      };
    case AWAIT.STAKED_AMOUNT:
      return {
        ...state,
        stakedAmount: [...action.payload],
      };
    case AWAIT.APPROVAL_CHECK:
      return {
        ...state,
        approvalCheck: [...action.payload],
      };

    default:
      return state;
  }
};
