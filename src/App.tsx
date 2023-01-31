import React from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
// Redux
import { Provider } from "react-redux";
// import {store} from "../src/redux/store";

import MetaBtn from './components/metamask/metamask-btn';
import Navbar from './components/dashboard/Navbar';
import Container from './components/dashboard/Container';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Container/>
    </div>
  );
}

export default App;
