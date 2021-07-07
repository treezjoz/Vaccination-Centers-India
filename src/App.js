import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Display from "./Display";
import "./css/styles.css";

export default function App() {
  const PrivateRoute = ({ component: Component, ...rest }) =>
    (
      <Route
        {...rest}
        render={props =>
          sessionStorage.getItem('token') ?
          (<Component {...props} />) :
          (<Redirect to={{pathname: "/"}}/>)}/>
    );

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Login} />
          <PrivateRoute path="/display" component={Display} />
        </Switch>
      </div>
    </Router>
  );
};
