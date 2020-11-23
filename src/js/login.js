import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./view/login";
import User from "./view/user";
import "../css/app.css";

class Layout extends React.Component {
  constructor(props){ 
    super(props);
  }

  render(){
    return (
      <Login></Login>
    );
  }
}

const app = document.getElementById('app');

ReactDOM.render(
  <Router>
    <Switch>
    <Route exact path="/" component={Login}></Route>
    <Route exact path="/user" component={User}></Route>
    <Route path="/user/:user_id" component={User}></Route>
    <Route exact component={Login}></Route>
    </Switch>
  </Router>,
app);
