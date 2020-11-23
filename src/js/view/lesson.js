import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import datetimeUtil from "../util/datetime";
import api from "../util/apiclient";
import appcss from "../../css/app.css";


class Lesson extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {lesson: this.props.data.lesson, datestring: this.props.match.params.datestring};
    }
    componentDidMount(){
        const {piece} = this.props.match.params;
        console.log(piece);
        console.log("lesseon request");
        api.get(
            "/api/playlist", 
            {params: {
                datestring: this.state.datestring,
                piece_id: piece
            }} 
        ).then(res => {
            console.log("playlist response");
            console.log(res.data);
            this.setState({lesson: res.data[0]});
            this.props.data.lesson = res.data[0];
        }).catch(err => {console.error(err);});
    }
    render() {     
        console.log("lesson render");   
        const {piece} = this.props.match.params;           
        console.log(piece);
        //console.log(this.props.data);
        //const lesson = this.props.data.lesson;
        const lesson = this.state.lesson;
        const name = lesson ? `${lesson.piece.name} (${lesson.piece.composer})` : "";
        const playbutton = (lesson && lesson.done) ? 
        <Link to={`/lesson/${piece}/${this.state.datestring}/play/${lesson.recording._id}`}>
            <button className="btn btn-success btnLesson">
                <i className="material-icons icons">play_arrow</i>
                <span className="btnLabel">Play</span>
            </button>
        </Link> 
        : null;
        const recordbutton = this.state.datestring == datetimeUtil.getDatestring() ?              
        <Link to={`/lesson/${piece}/${this.state.datestring}/record`}>
            <button className="btn btn-danger btnLesson">
                <i className="material-icons icons">videocam</i>
                <span className="btnLabel">{(lesson && lesson.done) ? "Re-Record" : "Record"}</span>
            </button>
        </Link>
        : null;

            return (
            <div className="lesson-container">
                <br/>
                <h3>{datetimeUtil.parseDatestring(this.state.datestring).format("LL")}</h3>
                <br/>
                <h3>{name}</h3>
                <Link to={`/playlist/${this.state.datestring}`}>
                    <button className="btn btn-primary btnLesson">
                        <span className="btnLabel">Back</span>
                    </button>
                </Link>

                {playbutton}

                {recordbutton}
           </div>
        );
    }
}

export default Lesson;
