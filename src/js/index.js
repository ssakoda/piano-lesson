import React from "react";
import ReactDOM from "react-dom";
import App from './view/app'
import { HashRouter as Router, Route, Switch } from "react-router-dom";


class Layout extends React.Component {
  constructor(props){ 
    super(props);
    this.stream = null;
    this.socket = null;
    this.isStopped = false;
    this.totalSize = 0;
    this.data = {};
    this.state = {isStandBy : false};
  }
}

const app = document.getElementById('app');

ReactDOM.render(
  <Router>
        <Route component={App}></Route>
  </Router>,
app);
