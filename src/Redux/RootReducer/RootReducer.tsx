import { combineReducers } from "redux";
import { stakingReducer } from "../Reducer";

export const rootReducer = combineReducers({
  staking: stakingReducer,
});
