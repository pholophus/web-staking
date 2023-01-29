import Web3 from "web3";
import listSCJson from "../data/oasis-smart-contract.json";
import {SC as SCClass} from "../interface/index";
import lp from "../data/abi/lp.json"
import masterchef from "../data/abi/masterchef.json"
import oasis from "../data/abi/oasis.json"
import rewardLocker from "../data/abi/rewardLocker.json"

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
const activeSC = async (listSC: any) => {

    const activeSC: any = [];

    for(const sc of listSC){

        try{
            const poolInfo = await sc.methods.poolInfo(0).call();
    
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
const unactiveSC = async (listSC: any) => {
    const unactiveSC: any = [];

    for(const sc of listSC){

        try{
            const poolInfo = await sc.methods.poolInfo(0).call();
    
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
const claimReward = async () => {
    
}

/**
 * APR calculation process
 */
const APR = async () => {
    
}

/**
 * user pending amount
 */
const pendingAmount = async () => {
    
}

/**
 * user staked amount
 */
const amountStaked = async () => {
    
}

/**
 * stake process
 */
const stake = async () => {
    
}

/**
 * filter farm user involved
 */
const myFarm = async () => {
    
}


/**
 * collect reward process
 */
 const collectReward = async () => {
    
}

/**
 * unstake process
 */
 const unstake = async () => {
    
}

/**
 * pool end time process
 */
 const pollEndTime = async () => {
    
}

/**
 * total amount stake of pool
 */
 const totalStakePool = async () => {
    
}

/**
 * balance for vested
 */
 const vestedBalance = async () => {
    
}

/**
 * list of vested balance
 */
 const vestedList = async () => {
    
}

/**
 * convert usd amount
 */
 const convertUSD = async () => {
    
}