import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from "web3";
import listSCJson from "../data/oasis-smart-contract.json";
import {SC as SCClass} from "../interface/index";
import lp from "../data/abi/lp.json"
import masterchef from "../data/abi/masterchef.json"
import oasis from "../data/abi/oasis.json"
import rewardLocker from "../data/abi/rewardLocker.json"
import pancakeSwap from "../data/abi/pancakeswapABI.json"

const [currentAccount, setCurrentAccount] = useState(""); 
const provider = new ethers.providers.Web3Provider(window.ethereum);
const { ethereum } = window;

useEffect(() => {
    getAccount();
}, []);

/**
 * get account
 */
const getAccount = async () => {
    try {
        const {ethereum} = window;
        ethereum.on('accountsChanged', (accounts: any) => {
        console.log("Account changed to:", accounts[0]);
        setCurrentAccount(accounts[0]);
        });

    } catch (error) {
        console.log(error);
    }
}

/**
 * loop every smart contract 
 * */
const readSC = async () => {

    const listSC: any = [];
    
    for(const SCJson of listSCJson ){
        
        let sc: SCClass = new SCClass();

        for (const [key, value] of Object.entries(SCJson)) {
            if (key in sc) {

                switch (key){
                    case "masterchef":
                        (sc as any)[key] = await new (window as any).web3.eth.Contract(masterchef, value);
                        break;
                    case "reward":
                        (sc as any)[key] = await new (window as any).web3.eth.Contract(rewardLocker, value);
                        break;
                    case "staked":
                        (sc as any)[key] = await new (window as any).web3.eth.Contract(lp, value);
                        break;
                    case "rewardToken":
                        (sc as any)[key] = await new (window as any).web3.eth.Contract(oasis, value);
                        break;
                    default:
                        (sc as any)[key] = value;
                }
            }
        }

        listSC.push(sc);
   }
    

}

/**
 * filter active smart contract
 */
const activeSC = async (listSC: SCClass[]) => {

    const activeSC: any = [];

    for(const sc of listSC){

        try{
            const poolInfo = await sc.masterchef.methods.poolInfo(0).call();
    
            if((Date.now()/ 1000) > poolInfo.unlockDate) activeSC.push(sc)
    
        }catch(e){
    
            console.log('checkActiveContract')
            console.log(e)
    
        }
    }
}

/**
 * filter unactive smart contract
 */
const unactiveSC = async (listSC: SCClass[]) => {
    const unactiveSC: any = [];

    for(const sc of listSC){

        try{
            const poolInfo = await sc.masterchef.methods.poolInfo(0).call();
    
            if((Date.now()/ 1000) < poolInfo.unlockDate) unactiveSC.push(sc)
    
        }catch(e){
    
            console.log('checkActiveContract')
            console.log(e)
    
        }
    }
}

/**
 * claim reward process
 */
const claimReward = async (sc: SCClass) => {

    try {
        await sc.masterchef.methods.harvestAll().send({from: currentAccount})
    } catch (error) {
        
    }
}

/**
 * APR calculation process
 */
const APR = async (scGroup:SCClass) => {

    try {
        const pancakeSC = await new (window as any).web3.eth.Contract(pancakeSwap, "0x10ED43C718714eb63d5aA57B78B54704E256024E");

        const oasisPerBlock = scGroup.masterchef.methods.oasisPerBlock().call();

        const poolInfo = scGroup.masterchef.methods.poolInfo().call;

        const emissionPerBlock = Web3.utils.fromWei(oasisPerBlock, 'ether');

        /**
         * single APR callculation
         */
        if(scGroup.type == "single") return ((parseFloat(emissionPerBlock) * 10368000 ) / poolInfo.totalDeposited) * 100;
        
        /**
         * lp APR callculation
         */
        const getReserves = scGroup.staked.methods.getReserves().call();

        const oasisAmount = Web3.utils.fromWei(getReserves._reserve0, 'ether');
        const bnbAmount = Web3.utils.fromWei(getReserves._reserve1, 'ether');
        
        const oasisConversion = pancakeSC.methods.getAmountsOut("1000000000000000000", ["0xb19289b436b2f7a92891ac391d8f52580d3087e4", "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"]).call();
        const bnbConversion = pancakeSC.methods.getAmountsOut("1000000000000000000", ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"]).call();

        const oasisUSD = Web3.utils.fromWei(oasisConversion[2], 'ether');
        const bnbUSD = Web3.utils.fromWei(bnbConversion[1], 'ether');

        const totalUSD = (parseFloat(oasisAmount) * parseFloat(oasisUSD)) + (parseFloat(bnbAmount) * parseFloat(bnbUSD));

        const totalSupply = scGroup.staked.methods.totalSupply().call();

        const priceLP = totalUSD/parseFloat(Web3.utils.fromWei(totalSupply, 'ether'));

        return ((parseFloat(emissionPerBlock) * 10368000 ) / (poolInfo.totalDeposited * priceLP)) * 100; 

    } catch (error) {
         
    }

}

/**
 * user pending amount
 */
const pendingAmount = async (sc: any) => {
    try {
        const pendingAmout = await sc.methods.pendingOasis(0, currentAccount).call();

        return parseFloat(Web3.utils.fromWei(pendingAmout, 'ether')).toFixed(2);

    } catch (error) {
        
    }
}

/**
 * user staked amount
 */
const amountStaked = async (sc: any) => {
    try {
        const userInfo = await sc.methods.userInfo(0, currentAccount).call();

        return parseFloat(Web3.utils.fromWei(userInfo.amount, 'ether')).toFixed(2);

    } catch (error) {
        
    }
}

/**
 * stake process
 */
const stake = async (sc:SCClass, amount: any) => {

    try {

        await sc.masterchef.methods.deposit(0,  Web3.utils.toWei(amount, 'ether'), 0).send({from: currentAccount});

    } catch (error) {
        
    }
}

/**
 * filter farm user involved
 */
const myFarm = async (listSC: SCClass[]) => {

    const mySC: any = [];
    var index = 0;

    for(const sc of listSC){

        try{
            const stakeAddress = listSCJson[index].staked;

            const escrowBalance = await sc.reward.methods.accountEscrowedBalance(currentAccount, stakeAddress).call();
    
            if(parseFloat(Web3.utils.fromWei(escrowBalance, 'ether')) > 0) mySC.push(sc);

            index++;
    
        }catch(e){
    
            console.log('my farm')
            console.log(e)
    
        }
    }
}


/**
 * collect reward process
 */
const collectReward = async (sc: SCClass) => {

    try {
        await sc.reward.methods.vestCompletedSchedule("0xb19289b436b2f7a92891ac391d8f52580d3087e4").send({from: currentAccount})

    } catch (error) {
        
    }
}

/**
 * unstake process
 */
const unstake = async (sc: SCClass, amount: any) => {
    
    try {

        await sc.masterchef.methods.withdraw(0,  Web3.utils.toWei(amount, 'ether'), 0).send({from: currentAccount});

    } catch (error) {
        
    }
}

/**
 * pool end time process
 */
 const poolEndTime = async (sc: SCClass) => {

    try {
        const poolInfo = await sc.masterchef.methods.poolInfo().call();

        return timeConversion(parseInt(poolInfo.unlockDate) - (Date.now()/ 1000));

    } catch (error) {
        
    }
}

/**
 * total amount stake of pool
 */
 const totalStakePool = async (sc: SCClass) => {

    try {
        
        const poolInfo = await sc.masterchef.methods.poolInfo().call();

        return poolInfo.totalDeposited 

    } catch (error) {
        
    }

}

/**
 * balance for vested
 */
 const vestedBalance = async (sc: SCClass) => {
    
    try {
        const stakeAddress = sc.type == "single" ? "0xb19289b436b2f7a92891ac391d8f52580d3087e4" : "0xa487E06cB74790a09948a69C81A44a12f8FFA6C3";

        const vestedBalance = await sc.reward.methods.accountVestedBalance(currentAccount, stakeAddress).call();

        return vestedBalance

    } catch (error) {
        
    }
}

/**
 * list of vested balance
 */
 const vestedList = async (sc: SCClass) => {
    try {
        const stakeAddress = sc.type == "single" ? "0xb19289b436b2f7a92891ac391d8f52580d3087e4" : "0xa487E06cB74790a09948a69C81A44a12f8FFA6C3";

        const vestList = await sc.reward.methods.getVestingSchedules(currentAccount, stakeAddress).call();

        /**
         * 
        startBlock;
        endBlock;
        quantity;
        vestedQuantity;
         */
        return vestList

    } catch (error) {
        
    }
}

/**
 * convert usd amount
 */
 const convertUSD = async (amount: any, ) => {
    try {

        const pancakeSC = await new (window as any).web3.eth.Contract(pancakeSwap, "0x10ED43C718714eb63d5aA57B78B54704E256024E");

        //amount needs to be in wei
        const oasisConversion = pancakeSC.methods.getAmountsOut(amount, ["0xb19289b436b2f7a92891ac391d8f52580d3087e4", "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"]).call();
        // const bnbConversion = pancakeSC.methods.getAmountsOut(amount, ["0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"]).call();

        const oasisUSD = Web3.utils.fromWei(oasisConversion[2], 'ether');
        // const bnbUSD = Web3.utils.fromWei(bnbConversion[1], 'ether');

        return oasisUSD;

    } catch (error) {
        
    }
}

const timeConversion = async (milliseconds: any) => {
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = Math.floor(hours / 24);

    const remainingHours = Math.floor(hours % 24);
    const remainingMinutes = Math.floor(minutes % 60);

    return `${days}:${remainingHours}:${remainingMinutes}`;
}