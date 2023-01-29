import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import dashboardReducer from "./reducers/dashboardReducer";
import appReducer from "./reducers/appReducer";

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  appConfig: appReducer,
});

// Array of all middlewares to be applied.
const middlewares = [thunk];

// devtools for debugging in dev environment.
const devTools =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : (a) => a;
    
const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares), devTools)
);

export default store;