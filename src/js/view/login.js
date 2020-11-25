import React from "react";

class Login extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
      return (
        <div className="login">
          <h1 className="app-title">Piano Lesson</h1>
          <form name="login" method="POST" action="/login">
              username: <input type="text" name="username"></input><br/>
              password: <input type="password" name="password"></input><br/>
              <div id="msg" className="error-msg"></div>
              <input type="submit" value="Login"></input> 
              <input type="reset" value="Reset"></input> 
          </form>
        </div>
      )
    }
}
  
export default Login;