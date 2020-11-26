import React from "react";
import api from "../util/apiclient";
import { Link } from "react-router-dom";

const MAX_SIZE = 50 * 1024 * 1024;

class Recording extends React.Component {
    constructor(props){
        super(props);
        this.stream = null;
        this.socket = null;
        this.state = {
          isStopped : true, 
          recording: null, 
          datestring: this.props.match.params.datestring,
          totalSize: 0
        };
        //console.log(props);
    }

    componentDidMount(){
      const {piece} = this.props.match.params;
      if(!this.props.data || !this.props.data.lesson) return;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        console.log("object setting...");
        let video = document.getElementById("video");
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
        console.log("object set");
        this.stream = stream;
       return stream;
      }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => {
          //console.log(e);
          this.setState({totalSize: this.state.totalSize + e.data.size});
          this.socket.send(e.data);          
          if(this.state.totalSize > MAX_SIZE) this.stopRecording();
          if(this.state.isStopped == true){
            console.log("last parts is sent, calling stop...");
            setTimeout(() =>{
            api.post(
              "/api/stop", 
              {recording_id: this.state.recording._id},
              {headers:{"Content-type" : "application/json"}} 
            ).then((resp) => {
              //console.log(resp.data);
              console.log("calling stop");
              if(this.socket && this.socket.connected){
                  //this.socket.disconnect();
                  this.socket.close();
              }
              this.props.history.push('/lesson/' + piece + '/' + this.state.datestring);
            });
            }, 1000);
          }
        }
      }).catch((err) => {
        console.log(err);
      });
      console.log("end");
    }

    startRecording(){
      if(!this.props.data.lesson){
        alert("Session expired");
        return;
      }
      console.log("start recording...");
      const lesson = this.props.data.lesson;
      let param = {piece_id: lesson.piece._id, datestring: this.state.datestring};
      if(this.props.data && this.props.data.lesson && this.props.data.lesson.done == true && this.props.data.lesson.recording){
        param.recording_id = this.props.data.lesson.recording._id;
      }
      api.post(
        "/api/start", 
        param,
        {headers:{"Content-type" : "application/json"}} 
      ).then(res => {
          //console.log(res);
          this.setState({isStopped: false,  recording: res.data});
          const socket = new WebSocket(res.data.wsprotocol + "://" + res.data.wshostname + ":" + res.data.wsport + "/ws/data");
          this.socket = socket;
          //console.log(socket);        
          socket.onopen = () => {
            console.log("client opened");
            socket.send(JSON.stringify({recording_id: res.data._id}));
          }
          socket.onmessage = (e) => {console.log("client message"); console.log(e);}
          socket.onerror = (e) => {console.log("client error"); console.log(e);}
          socket.onclose = () => {console.log("client closed");}
          this.mediaRecorder.start(2*1000);
      }).catch(err => {
        console.error(err);
      });
    }
    
    stopRecording(){
      console.log("stop recording...");
      if(this.mediaRecorder && this.mediaRecorder.state != "inactive"){
        this.mediaRecorder.stop();
      }else{
        if(this.socket && this.socket.readyState < 2){
          //this.socket.disconnect();
          this.socket.close();
        }
      }
      this.setState({isStopped: true});
    }
    
    render() {
      console.log("Recording render");
      const {piece} = this.props.match.params;
      //console.log(piece);
      let recordButton = (
        <button className="btn btn-danger btnLesson" onClick={this.startRecording.bind(this)}>
          <i className="material-icons icons">fiber_manual_record</i>
          <span className="btnLabel">Record</span>
        </button>
      );
      let stopButton = (
        <button className="btn btn-danger btnLesson" onClick={this.stopRecording.bind(this)}>
          <i className="material-icons icons">stop</i>
          <span className="btnLabel">Stop</span>
        </button>
      );
      return (
          <div className="video-recording">
            <div className="totalSize">{`total size:${Math.round(this.state.totalSize / 1024 / 1024 * 100)/100} MB`}</div>
            {this.state.isStopped ?
            <Link to={`/lesson/${piece}/${this.state.datestring}`}>
                <button className="btn btn-primary btnLesson" onClick={this.stopRecording.bind(this)}>
                    <span className="btnLabel">Back</span>
                </button>
            </Link> : ""
            }
            {this.state.isStopped ? recordButton : stopButton}
            <br/>
            <video id="video" controls={false} muted={true}></video><br/>
          </div>
      );
    }
}

export default Recording;