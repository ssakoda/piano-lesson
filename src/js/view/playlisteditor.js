import React from "react";
import Modal from "react-modal";
import api from "../util/apiclient";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Autosuggest from 'react-autosuggest';

Modal.setAppElement("#app");
  
  const theme = {
    container: 'react-autosuggest__container inputField col-12 col-md-9 col-lg-9',
    containerOpen:            'react-autosuggest__container--open',
    input:                    'react-autosuggest__input',
    inputOpen:                'react-autosuggest__input--open',
    inputFocused:             'react-autosuggest__input--focused',
    suggestionsContainer:     'react-autosuggest__suggestions-container',
    suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
    suggestionsList:          'react-autosuggest__suggestions-list',
    suggestion:               'react-autosuggest__suggestion',
    suggestionFirst:          'react-autosuggest__suggestion--first',
    suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
    sectionContainer:         'react-autosuggest__section-container',
    sectionContainerFirst:    'react-autosuggest__section-container--first',
    sectionTitle:             'react-autosuggest__section-title'
}

class PlaylistEditor extends React.Component {
    constructor(props){
        super(props);
        console.log("PlaylistEditor constructor");
        //console.log(props);
        this.state = {
            isEditMode: this.props.isEditMode,
            pieces: [],
            piece: {name: "", composer: ""},
            selectedPieceId: "",
            composers: [],
            suggestions: []
        };
        this.close = this.props.close.bind(this);
    }

    componentDidMount(){
        this.load();
    }
    
    load(){
        //tihs.setState({selectedPieceId: ""});
        console.log("load called");
        api.get(
            "/api/pieces", 
            {params: {inlist: false}} 
        ).then(res => {
            console.log("pieces response");
            //console.log(res.data);
            this.setState({pieces: res.data});
        }).then(() => {
            console.log("query composers:");
            return api.get(
                "/api/composers"
            );
        }).then(res2 => {
            console.log("composers response:");
            //console.log(res2);
            //console.log("composers:");
            const composers = res2.data;
            //console.log(composers);
            this.setState({composers: composers});
        }).catch(err => {console.error(err);});
    }

    handleCloseEditPiece(){
        this.close();
    }

    handleOnPieceListChange(e){
        this.setState({selectedPieceId: e.target.value});
    }

    handleAdd(){
        if(this.state.selectedPieceId){
            const newPiece = {_id: this.state.selectedPieceId, inlist: true};
            this.upsertPiece(newPiece);
            this.setState({selectedPieceId: ""});
        }
    }

    handleFieldChange(e){
        const newEditor = Object.assign({}, this.state.piece);
        newEditor[e.target.name] = e.target.value;
        this.setState({piece: newEditor});
    }

    handleSave(){
        const newPiece = Object.assign({}, this.state.piece);
        newPiece.inlist = true;
        this.upsertPiece(newPiece);
        this.setState({piece: {name: "", composer: ""}});
    }

    upsertPiece(piece){
        api.post("/api/piece", piece, {
            headers: {"Content-Type": "application/json"}
        }).then(data => {
            console.log("upserted OK");
            //console.log(data);
            this.load();
            this.handleCloseEditPiece();
        }).catch(err => {
            console.log("upserted NG");
            console.error(err);
        });
    }

    // suggestion
    onChange(event, { newValue }){
        const newEditor = Object.assign({}, this.state.piece);
        newEditor.composer = newValue;
        this.setState({piece: newEditor});
    }

    onSuggestionsFetchRequested({ value }){
        console.log('onSuggestionsFetchRequested');
        const suggestions = this.getSuggestions(value);
        //console.log("suggestions");
        //console.log(suggestions);
        this.setState({suggestions: suggestions});
        //console.log(this.state.suggestions);
    }

    onSuggestionsClearRequested(){
        console.log('onSuggestionsClearRequested');
        this.setState({suggestions: []});
    }

    renderSuggestion(suggestion){
        return (
                <div>{suggestion}</div>
        );
    }

    getSuggestionValue(suggestion){
        return suggestion;
    }

    getSuggestions(value){
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        //console.log(`inputValue=${inputValue} inputLength=${inputLength}`);
        const result = inputLength === 0 ? [] : this.state.composers.filter((composer) =>{
            //console.log(`composer.toLowerCase().slice(0, inputLength) = ${composer.toLowerCase().slice(0, inputLength)}`);
            return composer.toLowerCase().slice(0, inputLength) === inputValue;
        });
        //console.log(result);
        return result;
    }

    render() {
        console.log("playlisteditor rendered"); 
        const value = this.state.piece.composer;
        const { suggestions } = this.state;

        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
          placeholder: 'Type a composer name...',
          value,
          onChange: this.onChange.bind(this)
        };

        return (
            <Modal isOpen={this.props.isEditMode}>
                <Tabs>
                    <TabList>
                        <Tab>Add from list</Tab>
                        <Tab>Add new piece</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="editor">
                            <div className="input row">
                                <span className="inputLabel col-12 col-md-3 col-lg-3">Pieces not in Playlist</span>
                                <select className="inputField col-12 col-md-9 col-lg-9" value={this.state.selectedPieceId} onChange={this.handleOnPieceListChange.bind(this)}>
                                    <option value=""> --- </option>
                                    {this.state.pieces.map((v,i)=>{
                                        console.log(v);
                                        if(v._id){
                                            return (
                                                <option key={v._id} value={v._id}>{`${v.name} (${v.composer})`}</option>
                                            );
                                        }else{
                                            console.log("pieces is null");
                                            return null;
                                        }
                                    })}
                            </select>
                            </div>
                        </div>
                        <div className="editor btnGroup">
                            <button className="btn btn-light btnLesson" onClick={this.close}>
                                <i className="material-icons icons">close</i>
                                <span className="btnLabel">Close</span>
                            </button>
                            <button className="btn btn-primary btnLesson" onClick={this.handleAdd.bind(this)}>
                                <i className="material-icons icons">save_alt</i>
                                <span className="btnLabel">Add to Playlist</span>
                            </button>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="editor">
                            <div className="input row">
                                <span className="inputLabel col-12 col-md-3 col-lg-3">Piece Name</span>
                                <input name="name" className="inputField col-12 col-md-9 col-lg-9" value={this.state.piece.name} onChange={this.handleFieldChange.bind(this)}></input>
                            </div>
                            <div className="input row">
                                <span className="inputLabel col-12 col-md-3 col-lg-3">Composer</span>
                                <Autosuggest
                                    theme={theme}
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                                    getSuggestionValue={this.getSuggestionValue.bind(this)}
                                    renderSuggestion={this.renderSuggestion.bind(this)}
                                    inputProps={inputProps}
                                />                            
                            </div>
                        </div>
                        <div className="editor btnGroup">
                            <button className="btn btn-light btnLesson" onClick={this.close}>
                                <i className="material-icons icons">close</i>
                                <span className="btnLabel">Close</span>
                            </button>
                            <button className="btn btn-primary btnLesson" onClick={this.handleSave.bind(this)}>
                                <i className="material-icons icons">save_alt</i>
                                <span className="btnLabel">Save</span>
                            </button>
                        </div>
                    </TabPanel>
                </Tabs>
            </Modal>
        );
    }
}

export default PlaylistEditor;