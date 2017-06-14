import React from 'react';

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
		});
		this.setState({
			editing: false
		});
	}
	render() {
		let editTemp = (
			<span>
				<h3>Today's log: </h3>
				<p> BGL: {this.state.note.title} mg/dl </p>
				<p> My meals for the day: {this.state.note.text} </p>
				<p> I drank {this.state.note.water} cup(s) of water today. </p>
				<p> Activity: {this.state.note.fitness} </p>
				<p> I slept for {this.state.note.sleep} hours last night. </p>
				<p> Stress level: {this.state.note.stress} /100</p>
				<p> Notes: {this.state.notes} </p>
			</span>
		);
		if(this.state.editing) {
			editTemp = (
				<form onSubmit={e => this.save.call(this,e)}>
					<div>
						<input type="text" defaultValue={this.state.note.title} onChange={this.changeHandler.bind(this)} name="title"/>
					</div>
					<div>
						<textarea name="text" id="" defaultValue={this.state.note.text} onChange={this.changeHandler.bind(this)}></textarea>
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