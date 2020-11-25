import React from "react";
import Playlist from './playlist';
import Lesson from './lesson';
import Recording from './recording';
import Player from './player';
import datetimeUtil from "../util/datetime";
import api from "../util/apiclient";
import { Route, Redirect } from "react-router-dom";
import appcss from "../../css/app.css";

class App extends React.Component {
    constructor(props){
        super(props);
        this.stream = null;
        this.socket = null;
        this.isStopped = false;
        this.totalSize = 0;
        this.state = {isStandBy : false};
        this.data = {};
        this.user = {};
    }

    componentDidMount(){
      api.get(
          "/api/me"
      ).then(res => {
          console.log("me response");
          //console.log(res.data);
          this.setState({user: res.data});
      });
    }

    goHome(){
      this.props.history.push('/');
    }
    
    render() {
      return (
        <div className="app">
          <div className="header">
            <h1 className="app-title" onClick={this.goHome.bind(this)}>Piano Lesson</h1>
            {this.state.user ? <div className="loginUser">for <a href={"/login#/user/" + this.state.user._id}>{this.state.user.name}</a></div> : null}
            <a className="logout" href="/logout">Logout</a>
          </div>
          <Route exact path="/">
            <Redirect to="/playlist" />
          </Route>
          <Route exact path="/playlist">
            <Redirect to={`/playlist/${datetimeUtil.getDatestring()}`}/>
          </Route>
          <Route exact path="/playlist/:datestring" render={routeProps => <Playlist {...routeProps} data={this.data}/>}></Route>
          <Route exact path="/lesson/:piece/:datestring" render={routeProps => <Lesson {...routeProps} data={this.data}/>}></Route> 
          <Route exect path="/lesson/:piece/:datestring/play/:recording_id" render={routeProps => <Player {...routeProps} data={this.data}/>}/>        
          <Route exect path="/lesson/:piece/:datestring/record" render={routeProps => <Recording {...routeProps} data={this.data}/>}/>        
        </div>
       );
    }
}
  
export default App;