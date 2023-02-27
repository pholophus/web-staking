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
import { ACTION } from "./Action";

//#region list component

export const FILTERING_SC = (data: any) => {
  return {
    type: ACTION.FILTERING_SC,
    payload: data,
  };
};

export const RESET_VALUE = () => {
  return {
    type: ACTION.RESET,
  };
};

export const ADD_INDEX = (data: number) => {
  return {
    type: ACTION.ADD_INDEX,
    payload: data,
  };
};

export const REMOVE_INDEX = (data: number) => {
  return {
    type: ACTION.REMOVE_INDEX,
    payload: data,
  };
};

export const SHOW_ACCORDION = () => {
  return {
    type: ACTION.SHOW_ACCORDION,
  };
};
//#endregion

//#region Menu Component

export const SET_POOL_TYPE = (data: string) => {
  return {
    type: ACTION.SET_POOL_TYPE,
    payload: data,
  };
};

export const SET_POOL_STATUS = (data: string) => {
  return {
    type: ACTION.SET_POOL_STATUS,
    payload: data,
  };
};

export const TOGGLE_FARM = () => {
  return {
    type: ACTION.TOGGLE_FARM,
  };
};
//#endregion

//#region pass function into action creator/s

const GET_INIT_DATA = (data: SCClass[]) => {
  return {
    type: ACTION.INIT_DATA,
    payload: data,
  };
};

const GET_DETAIL = (data: any) => {
  return {
    type: ACTION.GET_DETAIL,
    payload: data,
  };
};
//#endregion

//#region action creator/s

export const GET_POOL_DETAIL = (sc: any) => {
  return async (dispatch: any) => {
    try {
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
