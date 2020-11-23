import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import datetimeUtil from "../util/datetime";
import api from "../util/apiclient";
import appcss from "../../css/app.css";

class Player extends React.Component {
  constructor(props){
     super(props);
      console.log(props);
      this.state = {
        signedUrl : '', 
        datestring: this.props.match.params.datestring,
        recording_id: this.props.match.params.recording_id
      };
  }
  componentDidMount(){
    if(this.props.data.lesson){
      const lesson_id = this.props.data.lesson.recording._id;
      console.log("lesson_id:" + lesson_id);
      api.get("/api/recording/" + this.state.recording_id ).then(res => {
        console.log(res);
        this.setState({signedUrl :res.data.signedUrl});
        console.log("signedUrl:" + this.state.signedUrl);
      });
    }
  }

  render() {
    console.log("Player render");
    const {piece} = this.props.match.params;
    console.log(piece);
    const lesson = this.props.data.lesson;
    console.log(lesson);
    //this.state.signedUrl = "https://skd-piano-lesson.s3.ap-northeast-1.amazonaws.com/5JEddTUBmqxIxn8G/20201101/test-recording.webm?AWSAccessKeyId=AKIAYHT22GRJXU7O274I&Expires=1604894568&Signature=wljZ2OTUKnqmHc754RjCiN8%2FhNQ%3D";
    return (
      <div>
        <Link to={`/lesson/${piece}/${this.state.datestring}`}>
            <button className="btn btn-primary btnLesson">
                <span className="btnLabel">Back</span>
            </button>
        </Link><br/>
        <video id="video" controls={true} src={this.state.signedUrl} autoPlay></video>
      </div>
    );
  }
}

export default Player;