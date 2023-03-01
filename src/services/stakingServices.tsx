import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import SCJson from "../data/oasis-smart-contract.json";
import { SC as SCClass, Vest } from "../interface/index";
import lp from "../data/abi/lp.json";
import masterchef from "../data/abi/masterchef.json";
import oasis from "../data/abi/oasis.json";
import rewardLocker from "../data/abi/rewardLocker.json";
import pancakeSwap from "../data/abi/pancakeswapABI.json";
import testnet from "../data/testnet.json";

// const [getAccount(), setgetAccount()] = useState("");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const { ethereum } = window;
const web3 = new Web3(window.ethereum);

/**
 * get account
 */
export const getAccount = async () => {
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    return "0x132dB02195a983399603F93a3f3BDf39B6dEcf71";
    return accounts[0];
  } catch (error) {
    console.log(error);
  }
};

/**
 * loop every smart contract
 * */
export const readSC = async () => {
  const listSC: any = [];

  // const listSCJson = process.env.REACT_APP_DEBUG_MODE === "true" ? testnet : SCJson;
  const listSCJson = SCJson;

  for (const SCJson of listSCJson) {
    let sc: SCClass = new SCClass();

    for (const [key, value] of Object.entries(SCJson)) {
      if (key in sc) {
        switch (key) {
          case "masterchef":
            (sc as any)[key] = await new web3.eth.Contract(
              masterchef as any,
              value as any
            );
            break;
          case "reward":
            (sc as any)[key] = await new web3.eth.Contract(
              rewardLocker as any,
              value as any
            );
            break;
          case "staked":
            (sc as any)[key] = await new web3.eth.Contract(
              lp as any,
              value as any
            );
            break;
          case "rewardToken":
            (sc as any)[key] = await new web3.eth.Contract(
              oasis as any,
              value as any
            );
            break;
          default:
            (sc as any)[key] = value;
        }
      }
    }

    listSC.push(sc);
  }
  return listSC;
};

/**
 * filter active smart contract
 */
export const activeSC = async (listSC: SCClass[]) => {
  const activeSC: any = [];

  for (const sc of listSC) {
    try {
      const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

      if (Date.now() / 1000 < poolInfo.unlockDate) activeSC.push(sc);
    } catch (e) {
      //console.log('checkActiveContract')
      console.log(e);
    }
  }

  return activeSC;
};

/**
 * filter unactive smart contract
 */
export const unactiveSC = async (listSC: SCClass[]) => {
  const unactiveSC: any = [];

  for (const sc of listSC) {
    try {
      const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

      if (Date.now() / 1000 > poolInfo.unlockDate) unactiveSC.push(sc);
    } catch (e) {
      //console.log('checkActiveContract')
      // console.log(e);
    }
  }

  return unactiveSC;
};

/**
 * claim reward process
 */
export const claimReward = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    await sc.masterchef.methods.harvestAll().send({ from: getAcc });
  } catch (error) {}
};

/**
 * APR calculation process
 */
export const APR = async (sc: SCClass) => {
  try {
    const pancakeSC = await new web3.eth.Contract(
      pancakeSwap as any,
      // "0x10ED43C718714eb63d5aA57B78B54704E256024E"
      "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
    );

    const oasisPerBlock = await sc.masterchef.methods.oasisPerBlock().call();

    const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

    if(parseFloat(Web3.utils.fromWei(poolInfo.totalDeposited)) <=0 ) return 0

    const emissionPerBlock = Web3.utils.fromWei(oasisPerBlock, "ether");

    const emmissionRate = parseFloat(emissionPerBlock) * 10368000;
    /**
     * single APR callculation
     */
    if (sc.type == "single") {
      const APR =
        (emmissionRate /
          parseFloat(Web3.utils.fromWei(poolInfo.totalDeposited))) *
        100;

      return APR.toFixed(2);
    }

    /**
     * lp APR callculation
     */
    const getReserves = await sc.staked.methods.getReserves().call();

    const oasisAmount = Web3.utils.fromWei(getReserves._reserve0, "ether");
    const bnbAmount = Web3.utils.fromWei(getReserves._reserve1, "ether");

    const oasisConversion = await pancakeSC.methods
      .getAmountsOut("1000000000000000000", [
        "0xb19289b436b2f7a92891ac391d8f52580d3087e4",
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      ])
      .call();

    const bnbConversion = await pancakeSC.methods
      .getAmountsOut("1000000000000000000", [
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      ])
      .call();

    const oasisUSD = Web3.utils.fromWei(oasisConversion[2], "ether");
    const bnbUSD = Web3.utils.fromWei(bnbConversion[1], "ether");

    const totalUSD =
      parseFloat(oasisAmount) * parseFloat(oasisUSD) +
      parseFloat(bnbAmount) * parseFloat(bnbUSD);

    const totalSupply = await sc.staked.methods.totalSupply().call();

    const priceLP =
      totalUSD / parseFloat(Web3.utils.fromWei(totalSupply, "ether"));

    const APR =
      (emmissionRate /
        (parseFloat(Web3.utils.fromWei(poolInfo.totalDeposited)) * priceLP)) *
      100;

    return APR.toFixed(2);
  } catch (error) {}
};

/**
 * user pending amount
 */
export const pendingAmount = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    const pendingAmout = await sc.masterchef.methods
      .pendingOasis(0, getAcc)
      .call();

    return parseFloat(Web3.utils.fromWei(pendingAmout, "ether")).toFixed(2);
  } catch (e: any) {
    console.error(e.message);
  }
};

/**
 * user staked amount
 */
export const amountStaked = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    const userInfo = await sc.masterchef.methods.userInfo(0, getAcc).call();

    return parseFloat(Web3.utils.fromWei(userInfo.amount, "ether")).toFixed(2);
  } catch (error) {}
};

/**
 * stake process
 */
export const stake = async (sc: SCClass, amount: any) => {
  try {
    const getAcc = await getAccount();

    await sc.masterchef.methods
      .deposit(0, Web3.utils.toWei(amount, "ether"), 0)
      .send({ from: getAcc });
  } catch (error) {
    console.error(error)
  }
};

/**
 * approve process
 */
export const approve = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    const masterchef = sc.masterchef._address

    await sc.rewardToken.methods
      .approve(masterchef, Web3.utils.toWei("999999", "ether"))
      .send({ from: getAcc });
  } catch (e: any) {
    console.error(e.message);
  }
};

/**
 * checkApproval process
 */
export const checkApproval = async (sc: SCClass) => {
  const getAcc = await getAccount();

  try {

    const masterchef = sc.masterchef._address

    const allowance = await sc.rewardToken.methods.allowance(getAcc, masterchef).call()

    const allowanceAmount = parseFloat(Web3.utils.fromWei(allowance, "ether"))

    console.log(parseFloat(Web3.utils.fromWei(balanceUser, "ether")))
    return parseFloat(Web3.utils.fromWei(balanceUser, "ether")) > 0
      ? true
      : false;
  } catch (error: any) {
    console.error(error.message);
  }
};

/**
 * get allowance amount
 */
 export const allowanceAmount = async (sc: SCClass) => {
  const getAcc = await getAccount();

  try {

    const masterchef = sc.masterchef._address

    const allowance = await sc.rewardToken.methods.allowance(getAcc, masterchef).call()

    const allowanceAmount = parseFloat(Web3.utils.fromWei(allowance, "ether"))

    return allowanceAmount

  } catch (error: any) {
    console.error(error.message);
  }
};

/**
 * get allowance amount
 */
 export const allowanceAmount = async (sc: SCClass) => {
  const getAcc = await getAccount();

  try {

    const masterchef = sc.masterchef._address

    const allowance = await sc.rewardToken.methods.allowance(getAcc, masterchef).call()

    const allowanceAmount = parseFloat(Web3.utils.fromWei(allowance, "ether"))

    return allowanceAmount

  } catch (error: any) {
    console.error(error.message);
  }
};

/**
 * filter farm user involved
 */
export const myFarm = async (listSC: SCClass[]) => {
  const mySC: any = [];

  for (const sc of listSC) {
    try {
      const stakeAddress =
        sc.type == "single"
          ? "0xb19289b436b2f7a92891ac391d8f52580d3087e4"
          : "0xa487E06cB74790a09948a69C81A44a12f8FFA6C3";

      const currentAcc = await getAccount();

      const escrowBalance = await sc.reward.methods
        .accountEscrowedBalance(currentAcc, stakeAddress)
        .call();

      if (parseFloat(Web3.utils.fromWei(escrowBalance, "ether")) > 0)
        mySC.push(sc);
    } catch (e) {
      //console.log('my farm')
      //console.log(e)
    }
    return mySC;
  }
};

/**
 * collect reward process
 */
export const collectReward = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    await sc.reward.methods
      .vestCompletedSchedules("0xb19289b436b2f7a92891ac391d8f52580d3087e4")
      .send({ from: getAcc });
  } catch (error: any) {
    console.error(error.message);
  }
};

/**
 * unstake process
 */
export const unstake = async (sc: SCClass, amount: any) => {
  try {
    const getAcc = await getAccount();

    await sc.masterchef.methods
      .withdraw(0, Web3.utils.toWei(amount, "ether"), 0)
      .send({ from: getAcc });
  } catch (error) {
    // console.error(error)
  }
};

/**
 * pool end time process
 */
export const poolEndTime = async (sc: SCClass) => {
  try {
    const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

    var timeLeft = parseInt(poolInfo.unlockDate) - Math.ceil(Date.now() / 1000);

    timeLeft = timeLeft > 0 ? timeLeft : 0;

    return timeConversion(timeLeft);
  } catch (error) {}
};

/**
 * total amount stake of pool
 */
export const totalStakePool = async (sc: SCClass) => {
  try {
    const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

    return parseFloat(Web3.utils.fromWei(poolInfo.totalDeposited)).toFixed(2);
  } catch (error) {}
};

export const percentagePool = async (sc: SCClass) => {
  try {
    const poolInfo = await sc.masterchef.methods.poolInfo(0).call();

    const percentagePool =
      parseFloat(Web3.utils.fromWei(poolInfo.totalDeposited)) /
      parseFloat(Web3.utils.fromWei(poolInfo.poolLimit));

    return (percentagePool * 100).toFixed(2);
  } catch (error) {}
};

/**
 * balance for vested
 */
export const vestedBalance = async (sc: SCClass) => {
  try {
    const getAcc = await getAccount();

    const stakeAddress =
      sc.type == "single"
        ? "0xb19289b436b2f7a92891ac391d8f52580d3087e4"
        : "0xa487E06cB74790a09948a69C81A44a12f8FFA6C3";

    const vestedBalance = await sc.reward.methods
      .accountVestedBalance(getAcc, stakeAddress)
      .call();

    return parseFloat(Web3.utils.fromWei(vestedBalance, "ether")).toFixed(2);
  } catch (error) {}
};

/**
 * list of vested balance
 */
export const vestedList = async (sc: SCClass) => {
  try {
    const stakeAddress =
      sc.type == "single"
        ? "0xb19289b436b2f7a92891ac391d8f52580d3087e4"
        : "0xa487E06cB74790a09948a69C81A44a12f8FFA6C3";

    const getAcc = await getAccount();

    const vestList = await sc.reward.methods
      .getVestingSchedules(getAcc, stakeAddress)
      .call();

    var vestRewardList: Vest[] = [];

    for (const vest of vestList) {
      const vestReward: Vest = new Vest();

      const vestTimestamp = (await web3.eth.getBlock(vest.endBlock)).timestamp;

      const timeLeft = await timeConversion(
        (vestTimestamp as any) - Math.ceil(Date.now() / 1000)
      );

      // console.log(`now ---> ${Math.ceil(Date.now() / 1000)}`);
      // console.log(`block timestamp ---> ${parseFloat(vestTimestamp as any)}`);
      // console.log(
      //   "true or false ---> ",
      //   parseFloat(vestTimestamp as any) > Math.ceil(Date.now() / 1000)
      // );

      vestReward.date =
        parseFloat(vestTimestamp as any) > Math.ceil(Date.now() / 1000)
          ? (timeLeft as any)
          : await timeConversion(0);

      vestReward.amount = parseFloat(Web3.utils.fromWei(vest.quantity)).toFixed(
        2
      );
      vestReward.collected =
        vest.quantity == vest.vestedQuantity ? true : false;

      vestRewardList.push(vestReward);
    }
    /**
         * 
        startBlock;
        endBlock;
        quantity;
        vestedQuantity;
         */
    // console.log(vestRewardList);
    return vestRewardList;
  } catch (error) {}
};

/**
 * user oasis token balance
 */
export const userOasisBalance = async (sc: SCClass) => {
  const getAcc = await getAccount();

  try {
    const balanceUser = await sc.rewardToken.methods.balanceOf(getAcc).call();

    const balanceAmount = parseFloat(Web3.utils.fromWei(balanceUser, "ether"))

    return balanceAmount.toFixed(2);

  } catch (error) {
    console.log(error)
  }
};

/**
 * convert usd amount
 */
export const convertUSD = async (amount: any) => {
  try {
    if (amount <= 0) return "0.00";

    const pancakeSC = await new web3.eth.Contract(
      pancakeSwap as any,
      "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );

    //amount needs to be in wei
    const WeiAmount = Web3.utils.toWei(amount, "ether");
    const oasisConversion = await pancakeSC.methods
      .getAmountsOut(WeiAmount, [
        "0xb19289b436b2f7a92891ac391d8f52580d3087e4",
        "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      ])
      .call();
    // const bnbConversion = pancakeSC.methods.getAmountsOut(amount, ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"]).call();

    const oasisUSD = Web3.utils.fromWei(oasisConversion[2], "ether");
    // const bnbUSD = Web3.utils.fromWei(bnbConversion[1], 'ether');

    return parseFloat(oasisUSD).toFixed(2);
  } catch (error: any) {
    // console.error(error.message);
  }
};

const timeConversion = async (seconds: any) => {
  if (seconds == 0) return `0D:0H:0M`;

  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = Math.floor(hours / 24);

  const remainingHours = Math.floor(hours % 24);
  const remainingMinutes = Math.floor(minutes % 60);

  return `${days}D:${remainingHours}H:${remainingMinutes}M`;
};

export const poolLimit = async (sc: SCClass) => {
  const maxCap = await sc.masterchef.methods.poolInfo(0).call();
  const poolLimit = Web3.utils.fromWei(maxCap.poolLimit, "ether");
  // console.log(poolLimit);
  return poolLimit;
};
