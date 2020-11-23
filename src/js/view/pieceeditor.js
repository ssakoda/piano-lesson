import React from "react";
import axios from 'axios';
import Modal from "react-modal";
import api from "../util/apiclient";

Modal.setAppElement("#app");

class PieceEditor extends React.Component {
    constructor(props){
        super(props);
        console.log("PieceEditor constructor");
        console.log(props);
        this.state = {
            isEditMode: this.props.isEditMode,
            piece: {}
        };
        this.close = this.props.close.bind(this);

   }   

    handleCloseEditPiece(){
        this.close();
    }

    handleFieldChange(e){
        const newEditor = Object.assign({}, this.state.piece);
        newEditor[e.target.name] = e.target.value;
        this.setState({piece: newEditor});
    }

    handleOutOfPlaylist(){
        const piece = this.state.piece;
        piece.inlist = false;
        this.save(piece);
     }
    
     handleSave(){
        this.save(this.state.piece);
     }
     
    save(piece){
        api.post("/api/piece", piece, {
            headers: {"Content-Type": "application/json"}
        }).then(data => {
            console.log("upserted OK");
            console.log(data);
            this.handleCloseEditPiece();
        }).catch(err => {
            console.log("upserted NG");
            console.error(err);
        });
     }

    static getDerivedStateFromProps(props, state){
        console.log("getDerivedStateFromProps");
        if(state.piece._id != props.piece._id) state.piece = props.piece;
        return state;
    }

    render() {
        console.log("pieceeditor rendered"); 
        return (
            <Modal isOpen={this.props.isEditMode}>
                <div className="editor">
                    <div className="input row">
                        <span className="inputLabel col-12 col-md-3 col-lg-3">Piece Name</span>
                        <input name="name" className="inputField col-12 col-md-9 col-lg-9" value={this.state.piece.name} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                    <div className="input row">
                        <span className="inputLabel col-12 col-md-3 col-lg-3">Composer</span>
                        <input name="composer" className="inputField col-12 col-md-9 col-lg-9" value={this.state.piece.composer} onChange={this.handleFieldChange.bind(this)}></input>
                    </div>
                </div>
                <div className="editor btnGroup">
                    <button className="btn btn-light btnLesson" onClick={this.close}>
                        <i className="material-icons icons">close</i>
                        <span className="btnLabel">Close</span>
                    </button>
                    <button className="btn btn-danger btnLesson" onClick={this.handleOutOfPlaylist.bind(this)}>
                        <i className="material-icons icons">remove_circle_outline</i>
                        <span className="btnLabel">Out of Playlist</span>
                    </button>
                    <button className="btn btn-primary btnLesson" onClick={this.handleSave.bind(this)}>
                        <i className="material-icons icons">save_alt</i>
                        <span className="btnLabel">Save</span>
                    </button>
                </div>
            </Modal>
        );
    }
}

export default PieceEditor;