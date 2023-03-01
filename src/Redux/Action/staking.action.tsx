import { SC as SCClass } from "../../interface";
import {
  allowanceAmount,
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
  userOasisBalance,
  vestedBalance,
  vestedList,
} from "../../services";
import { RootState } from "../Store";

export const STAKING = {
  INIT_DATA: "INIT_DATA",
  GET_DETAIL: "GET_DETAIL",
  RESET: "RESET",
  ADD_INDEX: "ADD_INDEX",
  REMOVE_INDEX: "REMOVE_INDEX",
  FILTERING_SC: "FILTERING_SC",
  TOGGLE_FARM: "TOGGLE_FARM",
  SET_POOL_TYPE: "SET_POOL_TYPE",
  SET_POOL_STATUS: "SET_POOL_STATUS",
  CONVERT_USD: "CONVERT_USD",
  SHOW_MODAL: "SHOW_MODAL",
  HIDE_MODAL: "HIDE_MODAL",
  UPDATE_STAKED_AMOUNT: "UPDATE_STAKED_AMOUNT",
  UPDATE_OASIS_BAL: "UPDATE_OASIS_BAL",
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
    console.log(resp)
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
        const allowance = await allowanceAmount(sc);
        const oasisBalance = await userOasisBalance(sc);
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
            allowance,
            oasisBalance,
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

export const USD_CONVERTER = () => {
  return async (dispatch: any, getState: any) => {
    try {
      const pendingOasis = getState().staking.pendingOasis;
      const pendingVested = getState().staking.pendingVested;
      const stakedAmount = getState().staking.stakedAmount;

      const oasis = await Promise.all(
        pendingOasis.map(async (i: any) => {
          let item = await convertUSD(i);
          return item;
        })
      );

      const vest = await Promise.all(
        pendingVested.map(async (i: any) => {
          let item = await convertUSD(i);
          return item;
        })
      );

      const stake = await Promise.all(
        stakedAmount.map(async (i: any) => {
          let item = await convertUSD(i);
          return item;
        })
      );

      dispatch(stakingAction(STAKING.CONVERT_USD, { oasis, vest, stake }));
    } catch (e: any) {
      console.error(e.message);
    }
  };
};
