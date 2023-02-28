import { SC as SCClass } from "../../interface";
import {
  amountStaked,
  APR,
  checkApproval,
  convertUSD,
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
  CONVERT_USD: "CONVERT_USD",
};

//#reusable stakingAction fx
export const stakingAction = (type: any, data?: any) => {
  return {
    type: type,
    payload: data,
  };
};

//#action creators (asynchronous fx)
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
          stakingAction(STAKING.GET_DETAIL, {
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
      dispatch(stakingAction(STAKING.INIT_DATA, data));
    } catch (error: any) {
      console.error(error.message);
    }
  };
};

export const USD_CONVERTER = (arr: any) => {
  return async (dispatch: any) => {
    try {
      arr.map(async (i: any) => {
        const oasisUSD = await convertUSD(i);
        dispatch(STAKING.CONVERT_USD, oasisUSD);
      });
    } catch (e: any) {
      console.error(e.message);
    }
  };
};
