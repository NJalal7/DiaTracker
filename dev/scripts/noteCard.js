import React from 'react';
import Calendar from './calendar.js';
import moment from 'moment';


export default class NoteCard extends React.Component { 
	constructor() {
		super();
		this.state = {
			editing: false,
			note: {}
		};
	}
	componentDidMount() {
		this.setState({
			note: this.props.note,
		});
	}
	edit() {
		this.setState({
			editing: true
		});
	}
	changeHandler(e) {
		const newObj = Object.assign({},this.state.note,{
			[e.target.name]: e.target.value
		});
		this.setState({
			note: newObj 
		});
	}
	save(e) {
		e.preventDefault();
		const currentUser = firebase.auth().currentUser.uid;
		const objRef = firebase.database().ref(`users/${currentUser}/notes/${this.state.note.key}`);
		objRef.update({
			title: this.state.note.title,
			text: this.state.note.text,
			blg: this.state.note.blg,
			food: this.state.note.food,
			water: this.state.note.water,
			fitness: this.state.note.fitness,
			comments: this.state.note.comments,
			date: this.state.note.date,
		});
		this.setState({
			editing: false
		});
	}
	render() {
		let editTemp = (
			<span>
				<h3>Daily log for {moment(this.state.note.date).format("dddd, MMMM Do YYYY")}: </h3> 
				<p> BGL: {this.state.note.title} mg/dl </p>
				<p> My meals for the day: {this.state.note.text} </p>
				<p> I drank {this.state.note.water} cup(s) of water today. </p>
				<p> Activity: {this.state.note.fitness} </p>
				<p> I slept for {this.state.note.sleep} hours last night. </p>
				<p> Stress level: {this.state.note.stress} /100</p>
				<p> Notes: {this.state.note.comments} </p>
			</span>
		);
		if(this.state.editing) {
			editTemp = (
				<form onSubmit={e => this.save.call(this,e)}>
					<div>
						<label htmlFor="date">Daily log for {moment(this.state.note.date).format("dddd, MMMM Do YYYY")}: </label>
					</div>
					<div>
						<label htmlFor="blg">Enter your blood glucose level here: </label>
						<input type="text" defaultValue={this.state.note.title} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<label htmlFor="food">Enter your meals here: </label>
						<textarea name="text" id="" defaultValue={this.state.note.text} onChange={this.changeHandler.bind(this)}></textarea>
					</div>
					<div>
						<label htmlFor="note-water">Enter your water intake here: </label>
						<input type="number" defaultValue={this.state.note.water} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<label htmlFor="note-fitness"> Were you active today? If so, what did you do for exercise? </label>
						<input type="text" defaultValue={this.state.note.fitness} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<label htmlFor="note-sleep"> How many hours of sleep did you get last night? </label>
						<input type="number" defaultValue={this.state.note.sleep} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<label htmlFor="note-stress">On a scale of 1-100, how stressed were you today? </label>
						<input type="range" defaultValue={this.state.note.stress} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<label htmlFor="note-comments">Additional Notes: </label>
						<textarea name="text" id="" defaultValue={this.state.note.comments} onChange={this.changeHandler.bind(this)}></textarea>
					</div>
					<input type="submit"/>
				</form>
			)		
		}

		return (
			<div className="noteCard">
				<div className="fa fa-edit" onClick={e => this.edit.call(this)}></div>
				<i className="fa fa-times" onClick={e => this.props.removeNote.call(null,this.props.note.key)}></i>
				{editTemp}
			</div>
		);
	}
};