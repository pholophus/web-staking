import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";

import MetaBtn from "./components/metamask/metamask-btn";
import Navbar from "./components/dashboard/Navbar";
import Container from "./components/dashboard/Container";
import ContainerRedux from "./components/dashboard/Container.redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <ContainerRedux />
        {/* <Container /> */}
      </div>
    </Provider>
  );
}

export default App;
