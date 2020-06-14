import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createBrowserHistory } from 'history';
import { Router as HistoryProvider } from 'react-router';
import * as serviceWorker from "./serviceWorker";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <HistoryProvider history={history}>
      <>
        <App />
      </>
    </HistoryProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
