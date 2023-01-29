import React from 'react';
import logo from './logo.svg';
import './App.css';
// ROUTER
import { BrowserRouter } from "react-router-dom";
import { RouterConfig } from "../src/navigation/RouterConfig";
// Redux
import { Provider } from "react-redux";
import {store} from "../src/redux/store";


import MetaBtn from './components/metamask/metamask-btn';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Provider store={store}>
          <BrowserRouter>
            <RouterConfig/>
          </BrowserRouter>
        </Provider>
        <MetaBtn/>
      </header>
    </div>
  );
}

export default App;
