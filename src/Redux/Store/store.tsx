import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { rootReducer } from "../RootReducer";

const nonDebug = createStore(rootReducer, applyMiddleware(thunk));

const debug = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, thunk))
);

const debugMode = process.env.REACT_APP_REDUX_DEBUG;
export const store = debugMode === "on" ? debug : nonDebug;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
