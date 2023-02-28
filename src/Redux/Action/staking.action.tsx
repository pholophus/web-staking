import { SC as SCClass } from "../../interface";
import {
  amountStaked,
  APR,
  checkApproval,
  pendingAmount,
  percentagePool,
  poolEndTime,
  poolLimit,
  readSC,
  totalStakePool,
  vestedBalance,
  vestedList,
} from "../../services";

export const STAKING = {
  INIT_DATA: "INIT_DATA",
  GET_DETAIL: "GET_DETAIL",
  RESET: "RESET",
  ADD_INDEX: "ADD_INDEX",
  REMOVE_INDEX: "REMOVE_INDEX",
  SHOW_ACCORDION: "SHOW_ACCORDION",
  FILTERING_SC: "FILTERING_SC",
  TOGGLE_FARM: "TOGGLE_FARM",
  SET_POOL_TYPE: "SET_POOL_TYPE",
  SET_POOL_STATUS: "SET_POOL_STATUS",
};

//#region list component

export const FILTERING_SC = (data: any) => {
  return {
    type: STAKING.FILTERING_SC,
    payload: data,
  };
};

export const RESET_VALUE = () => {
  return {
    type: STAKING.RESET,
  };
};

export const ADD_INDEX = (data: number) => {
  return {
    type: STAKING.ADD_INDEX,
    payload: data,
  };
};

export const REMOVE_INDEX = (data: number) => {
  return {
    type: STAKING.REMOVE_INDEX,
    payload: data,
  };
};

export const SHOW_ACCORDION = () => {
  return {
    type: STAKING.SHOW_ACCORDION,
  };
};
//#endregion

//#region Menu Component

export const SET_POOL_TYPE = (data: string) => {
  return {
    type: STAKING.SET_POOL_TYPE,
    payload: data,
  };
};

export const SET_POOL_STATUS = (data: string) => {
  return {
    type: STAKING.SET_POOL_STATUS,
    payload: data,
  };
};

export const TOGGLE_FARM = () => {
  return {
    type: STAKING.TOGGLE_FARM,
  };
};
//#endregion

//#region pass function into action creator/s

const GET_INIT_DATA = (data: SCClass[]) => {
  return {
    type: STAKING.INIT_DATA,
    payload: data,
  };
};

const GET_DETAIL = (data: any) => {
  return {
    type: STAKING.GET_DETAIL,
    payload: data,
  };
};
//#endregion

//#region action creator/s

export const GET_POOL_DETAIL = (resp: any) => {
  return async (dispatch: any) => {
    try {
      for (const sc of resp) {
        const endPool = await poolEndTime(sc);
        const APRValue = await APR(sc);
        const totalStake = await totalStakePool(sc);
        const percentagePoolValue = await percentagePool(sc);
        const pendingOasis = await pendingAmount(sc);
        const pendingVested = await vestedBalance(sc);
        const stakedAmount = await amountStaked(sc);
        const approvalCheck = await checkApproval(sc);
        const listVested = await vestedList(sc);
        const maxCap = await poolLimit(sc);
        dispatch(
          GET_DETAIL({
            endPool,
            APRValue,
            totalStake,
            percentagePoolValue,
            pendingOasis,
            pendingVested,
            stakedAmount,
            approvalCheck,
            listVested,
            maxCap,
          })
        );
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
};

export const INIT_DATA = () => {
  return async (dispatch: any) => {
    try {
      const data = await readSC();
      dispatch(GET_INIT_DATA(data));
    } catch (error: any) {
      console.error(error.message);
    }
  };
};

//#endregion
