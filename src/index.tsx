import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from "styled-components";
import {
  Provider as Web3Provider,
  Updater as Web3Updater
} from './context/Web3'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #ECECEC;
    font-family: Open-Sans, Helvetica, Sans-Serif;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Web3Provider>
      <App />
      <Web3Updater />
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
