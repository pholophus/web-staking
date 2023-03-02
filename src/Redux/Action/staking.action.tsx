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

export const AWAIT = {
  LIST_SC: "LIST_SC",
  END_POOL: "END_POOL",
  PENDING_OASIS: "PENDING_OASIS",
  PENDING_VESTED: "PENDING_VESTED",
  APR_VALUE: "APR_VALUE",
  TOTAL_STAKE: "TOTAL_STAKE",
  STAKED_AMOUNT: "STAKED_AMOUNT",
  PERCENTAGE_POOL_VALUE: "PERCENTAGE_POOL_VALUE",
  ALLOWANCE: "ALLOWANCE",
  OASIS_BALANCE: "OASIS_BALANCE",
  MAX_CAP: "MAX_CAP",
  LIST_VESTED: "LIST_VESTED",
  OASIS_USD: "OASIS_USD",
  VESTED_USD: "VESTED_USD",
  STAKE_USD: "STAKE_USD",
  APPROVAL_CHECK: "APPROVAL_CHECK",
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

export const AWAIT_ENDPOOL = (sc: any) => {
  return async (dispatch: any) => {
    const endPool = await poolEndTime(sc);
    dispatch(AWAIT.END_POOL, endPool);
  };
};

export const AWAIT_APRVALUE = (sc: any) => {
  return async (dispatch: any) => {
    const APRValue = await APR(sc);
    dispatch(AWAIT.APR_VALUE, APRValue);
  };
};

export const AWAIT_TOTAL_STAKE = (sc: any) => {
  return async (dispatch: any) => {
    const totalStake = await totalStakePool(sc);
    dispatch(AWAIT.TOTAL_STAKE, totalStake);
  };
};

export const AWAIT_PERCENTAGE_POOL_VALUE = (sc: any) => {
  return async (dispatch: any) => {
    const percentagePoolValue = await percentagePool(sc);
    dispatch(AWAIT.PERCENTAGE_POOL_VALUE, percentagePoolValue);
  };
};

export const AWAIT_PENDING_OASIS = (sc: any) => {
  return async (dispatch: any) => {
    const pendingOasis = await pendingAmount(sc);
    dispatch(AWAIT.PENDING_OASIS, pendingOasis);
  };
};

export const AWAIT_OASIS_USD = (sc: any) => {
  return async (dispatch: any, getState: any) => {
    const pendingOasis = getState().staking.pendingOasis; 
    const oasis = await Promise.all(
      pendingOasis.map(async (i: any) => {
        let item = await convertUSD(i);
        return item;
      })
    );
    dispatch(AWAIT.OASIS_USD, oasis);
  };
};

export const AWAIT_PENDING_VESTED = (sc: any) => {
  return async (dispatch: any) => {
    const pendingVested = await vestedBalance(sc);
    dispatch(AWAIT.PENDING_VESTED, pendingVested);
  };
};

export const AWAIT_VESTED_USD = (sc: any) => {
  return async (dispatch: any, getState: any) => {
    const pendingVested = getState().staking.pendingVested;
    const vested = await Promise.all(
      pendingVested.map(async (i: any) => {
        let item = await convertUSD(i);
        return item;
      })
    );
    dispatch(AWAIT.VESTED_USD, vested);
  };
};

export const AWAIT_STAKED_AMOUNT = (sc: any) => {
  return async (dispatch: any) => {
    const stakedAmount = await amountStaked(sc);
    dispatch(AWAIT.STAKED_AMOUNT, stakedAmount);
  };
};

export const AWAIT_STAKED_USD = (sc: any) => {
  return async (dispatch: any, getState: any) => {
    const stakedAmount = getState().staking.stakedAmount;
    const stake = await Promise.all(
      stakedAmount.map(async (i: any) => {
        let item = await convertUSD(i);
        return item;
      })
    );
    dispatch(AWAIT.STAKE_USD, stake);
  };
};

export const AWAIT_APPROVAL_CHECK = (sc: any) => {
  return async (dispatch: any) => {
    const approvalCheck = await checkApproval(sc);
    dispatch(AWAIT.APPROVAL_CHECK, approvalCheck);
  };
};

export const AWAIT_LIST_VESTED = (sc: any) => {
  return async (dispatch: any) => {
    const listVested = await vestedList(sc);
    dispatch(AWAIT.LIST_VESTED, listVested);
  };
};

export const AWAIT_MAX_CAP = (sc: any) => {
  return async (dispatch: any) => {
    const maxCap = await poolLimit(sc);
    dispatch(AWAIT.MAX_CAP, maxCap);
  };
};

export const AWAIT_ALLOWANCE = (sc: any) => {
  return async (dispatch: any) => {
    const allowance = await allowanceAmount(sc);
    dispatch(AWAIT.ALLOWANCE, allowance);
  };
};

export const AWAIT_OASIS_BAL = (sc:any) => {
  return async (dispatch:any) => {
    const balance = await userOasisBalance(sc)
    dispatch(STAKING.UPDATE_OASIS_BAL, balance)
  }
}




