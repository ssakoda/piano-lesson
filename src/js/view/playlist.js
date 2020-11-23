import React from "react";
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import datetimeUtil from "../util/datetime";
import api from "../util/apiclient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import PieceEditor from "./pieceeditor";
import PlaylistEditor from "./playlisteditor"

Modal.setAppElement("#app");
dayjs.extend(localizedFormat)

class Playlist extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            playlist: [], 
            datestring: this.props.match.params.datestring,
            isDatepickerOn: false,
            isEditMode: false,
            editor:{
                name: null,
                composer: null
            },
            isPlaylistEditMode: false
        };
        this.playlisteditorRef = React.createRef();
   }   

    componentDidMount(){
        console.log("playlist request");
        console.log("query for " + this.state.datestring);
        this.load();
    }

    load(){
        api.get(
            "/api/playlist", 
            {params: {datestring: this.state.datestring}} 
        ).then(res => {
            console.log("playlist response");
            console.log(res.data);
            this.setState({playlist: res.data});
        }).catch(err => {console.error(err);});
        this.playlisteditorRef.current.load();
    }

    prepRecording(target){
        console.log("prepRecording:");
        console.log(target);
        if(this.props.prepRecording){
            this.props.prepRecording();
        }
    }

    selectLesson(piece){
        console.log(piece);
    }

    handleChange(targetDate){
        this.props.history.push(`/playlist/${datetimeUtil.getDatestring(targetDate)}`);
        this.setState({
            targetDate: targetDate,
            datestring: datetimeUtil.getDatestring(targetDate),
            isDatepickerOn: false
        },this.componentDidMount);
    }

    handleDPClick(){
        this.setState({isDatepickerOn: true});
    }

    handlePlaylistClick(){
        this.setState({
            isPlaylistEditMode: true
        });
    }

    handlePlaylistEditClose(){
        this.setState({
            isPlaylistEditMode: false
        });
        this.load();
    }

    handleLessonClick(v){
        this.props.history.push(`/lesson/${v.piece._id}/${this.state.datestring}`);
        this.props.data.lesson = v;
    }

    handleEditPiece(v){
        this.setState({
            isEditMode: true,
            editor: v.piece
        });
    }

    handleEditClose(){
        this.setState({
            isEditMode: false
        });
        this.load();
    }

    render() {
        console.log("playlist rendered"); 
        if(!this.state.playlist) return null;
        const {targetDate} = this.state;
        const dp = this.state.isDatepickerOn ?
        <DatePicker selected={targetDate} onChange={this.handleChange.bind(this)} todayButton="Today"/> 
        : null;
        const dpbutton = !this.state.isDatepickerOn ?
        <span className="icons" onClick={this.handleDPClick.bind(this)} >
            <i className="material-icons icons">today</i>
        </span>
        : null;
        return (
            <div className="playlist-container">
                <br/>
                <h3>{datetimeUtil.parseDatestring(this.state.datestring).format("LL")} {dp} {dpbutton}</h3>
                <br/>
                <table className="table table-hover playlist">
                    <thead>
                        <tr>
                            <th width="30px">
                                <span>
                                    <i className="material-icons icons" onClick={this.handlePlaylistClick.bind(this)}>playlist_add</i>
                                </span>                               
                            </th>
                            <th width="50px">Staus</th>
                            <th>Title</th>
                            <th width="100px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.playlist.map((v,k)=>{ 
                        var status = "";
                        if(v.done){
                            status = (<i className="material-icons">done</i>);
                        }
                        return (
                            <tr key={v.piece._id}>
                                <td className="index">{(k+1)}</td>
                                <td className="status">
                                    {status}
                                </td>
                                <td className="title">{v.piece.composer} - {v.piece.name}</td>
                                <td className="action">
                                    <span className="icons" onClick={this.handleLessonClick.bind(this, v)}>
                                        <i className="material-icons icons">music_note</i>
                                    </span>
                                    <span className="icons" onClick={this.handleEditPiece.bind(this, v)}>
                                        <i className="material-icons icons">create</i>
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <PieceEditor isEditMode={this.state.isEditMode} close={this.handleEditClose.bind(this)} piece={this.state.editor}></PieceEditor>
                <PlaylistEditor ref={this.playlisteditorRef} isEditMode={this.state.isPlaylistEditMode} close={this.handlePlaylistEditClose.bind(this)}></PlaylistEditor>
            </div>
        );
    }
}

export default Playlist;