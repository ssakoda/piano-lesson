import React from "react";
import axios from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import datetimeUtil from "../util/datetime";
import api from "../util/apiclient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";

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
            }
        };
   }   

    componentDidMount(){
        console.log("playlist request");
        console.log("query for " + this.state.datestring);
        api.get(
            "/api/playlist", 
            {params: {datestring: this.state.datestring}} 
        ).then(res => {
            console.log("playlist response");
            console.log(res.data);
            this.setState({playlist: res.data});
        }).catch(err => {console.error(err);});
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

    handleLessonClick(v){
        this.props.history.push(`/lesson/${v.piece._id}/${this.state.datestring}`);
        this.props.data.lesson = v;
    }

    handleEditPiece(v){
        this.setState({
            isEditMode: true, 
            editor: {
                name: v.piece.name, 
                composer: v.piece.composer
            }
        });
    }

    handleCloseEditPiece(){
        this.setState({isEditMode: false});
        console.log("editor:");
        console.log(this.state);
    }

    handleFieldChange(e){
        console.log("event");
        console.log(e);
        const newEditor = Object.assign({}, this.state.editor);
        newEditor[e.target.name] = e.target.value;
        this.setState({editor: newEditor});
        console.log(this.state);
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
                                    <i className="material-icons icons">playlist_add</i>
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
                <Modal isOpen={this.state.isEditMode}>
                    <div className="editor">
                        <div className="input row">
                            <span className="inputLabel col-12 col-md-3 col-lg-3">Piece Name</span>
                            <input name="name" className="inputField col-12 col-md-9 col-lg-9" value={this.state.editor.name} onChange={this.handleFieldChange.bind(this)}></input>
                        </div>
                        <div className="input row">
                            <span className="inputLabel col-12 col-md-3 col-lg-3">Composer</span>
                            <input name="composer" className="inputField col-12 col-md-9 col-lg-9" value={this.state.editor.composer} onChange={this.handleFieldChange.bind(this)}></input>
                        </div>
                    </div>
                    <div className="editor btnGroup">
                        <button className="btn btn-light btnLesson" onClick={this.handleCloseEditPiece.bind(this)}>
                            <i className="material-icons icons">close</i>
                            <span className="btnLabel">Close</span>
                        </button>
                        <button className="btn btn-danger btnLesson" onClick={this.handleCloseEditPiece.bind(this)}>
                            <i className="material-icons icons">remove_circle_outline</i>
                            <span className="btnLabel">Out of Playlist</span>
                        </button>
                        <button className="btn btn-primary btnLesson" onClick={this.handleCloseEditPiece.bind(this)}>
                            <i className="material-icons icons">save_alt</i>
                            <span className="btnLabel">Save</span>
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Playlist;