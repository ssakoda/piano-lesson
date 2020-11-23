import React from "react";
import api from "../util/apiclient";

class User extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            errorMsg: "",
            user:{
                name: "",
                username: "",
                password: "",
                passwordconfirm: "",
                _id: ""
            }
        };
   }   

    componentDidMount(){
        console.log("User request");
        if(this.props.match.params.user_id){
            api.get(
                "/api/user/" + this.props.match.params.user_id
            ).then(res => {
                console.log("get user response");
                console.log(res.data);
                this.setState({user: {...this.state.user, ...res.data}});
            });
        }
    }

    handleFieldChange(e){
        const newUser = Object.assign({}, this.state.user);
        newUser[e.target.name] = e.target.value;
        this.setState({user: newUser});
    }

    close(){
        this.props.history.push("/");
    }

    handleSave(){
        if(this.state.user.password != this.state.user.passwordconfirm){
            this.setState({errorMsg: "password doesn't match"});
        }else if(this.state.user.username == ""){
            this.setState({errorMsg: "username is missing"});            
        }else{
            const newUser = {...this.state.user};
            delete newUser.passwordconfirm;
            if(newUser._id == "") delete newUser._id;
            api.post("/api/user", newUser, {headers : {"Content-Type": "application/json"}}).then(data => {
                console.log("user upserted");
                console.log(data);
                this.setState({user:{
                    name: "",
                    username: "",
                    password: "",
                    passwordconfirm: "",
                    _id: ""
                }});
                this.props.history.push("/");
            }).catch(err => {
                this.setState({errorMsg: err.message});            
            });
        }
    }

    render() {
        console.log("user rendered"); 
        return (
            <div className="user-container">
                <h2>User Maintenance</h2>
                <br/>
                <div className="fields col-12 col-md-12 col-lg-6">
                    <div id="user-msg" className="error-msg">{this.state.errorMsg}</div>
                    <div className="input row justify-content-center">
                        <span className="inputLabel col-10 col-md-4 col-lg-4">Name</span>
                        <input name="name" className="inputField col-10 col-md-6 col-lg-6" value={this.state.user.name} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                    <div className="input row justify-content-center">
                        <span className="inputLabel col-10 col-md-4 col-lg-4">Username</span>
                        <input name="username" className="inputField col-10 col-md-6 col-lg-6" value={this.state.user.username} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                    <div className="input row justify-content-center">
                        <span className="inputLabel col-10 col-md-4 col-lg-4">Password</span>
                        <input name="password" type="password" className="inputField col-10 col-md-6 col-lg-6" value={this.state.user.password} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                    <div className="input row justify-content-center">
                        <span className="inputLabel col-10 col-md-4 col-lg-4">Password (confirm)</span>
                        <input name="passwordconfirm" type="password" className="inputField col-10 col-md-6 col-lg-6" value={this.state.user.passwordconfirm} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                </div>
                <div/>
                <div className ="buttons">
                    <button className="btn btn-light btnLesson" onClick={this.close.bind(this)}>
                        <i className="material-icons icons">close</i>
                        <span className="btnLabel">Close</span>
                    </button>
                    <button className="btn btn-primary btnLesson" onClick={this.handleSave.bind(this)}>
                        <span className="btnLabel">Save</span>
                    </button>
                </div>
            </div>
        );
    }
}

export default User;