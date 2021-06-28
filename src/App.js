import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Otp from "./Otp";
import Display from "./Display";
import "./css/styles.css";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/enter-otp/:txnId"  component={Otp} />
          <Route path="/display/:token" component={Display} />
        </Switch>
      </div>
    </Router>

  );
};
