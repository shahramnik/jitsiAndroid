import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";

import Navigator from './routes';
import Login from "./component/auth/login/Login";
import Forgot from "./component/auth/forgot/Forgot";
import Home from "./component/dashboard/Home";
import Meeting from "./component/meeting";
import NewPassword from "./component/auth/changepassword/new-password";

function App() {
  return (
    <Router>
      <Navigator />
    </Router>
  );
}

export default App;
