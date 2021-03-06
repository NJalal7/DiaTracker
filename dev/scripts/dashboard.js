import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './noteCard.js';
import Calendar from './calendar.js';
import { 
	BrowserRouter as Router, 
	Route, Link } from 'react-router-dom';

export default class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			notes: [],
			blg: "",
			food: "",
			water: "",
			sleep: "",
			fitness: "",
			stress: "",
			comments: "",
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				firebase.database().ref(`users/${user.uid}/notes`)
					.on('value', (res) => {
						let userData = res.val();
						let dataArray = [];
						for(let key in userData) {
							userData[key].key = key;
							dataArray.push(userData[key])
						}
						this.setState({
							notes: dataArray
						});
					});
			}
		});
	}
	toggleOverlay() {
		this.overlay.classList.toggle('show');
	}
	toggleAddNote(e) {
		e.preventDefault();
		if(firebase.auth().currentUser) {
			this.sidebar.classList.toggle('show');
		}
		else {
			alert('Please login to add a new note');
		}
	}
	addNew(e) {
		e.preventDefault();
		const newNote = {
			date: this.noteDate.value,
			title: this.noteTitle.value,
			text: this.noteText.value,
			water: this.noteWater.value,
			sleep: this.noteSleep.value,
			fitness: this.noteFitness.value,
			stress: this.noteStress.value,
			comments: this.noteComments.value,

		};
		const newState = Array.from(this.state.notes);
		const currentUser = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${currentUser}/notes`);
		dbRef.push(newNote)
			.then(res => {
				newNote.key = res.key;
				newState.push(newNote);
				this.setState({
					notes: newState
				});

				this.noteDate.value = ''; 
				this.noteTitle.value = '';
				this.noteText.value = '';
				this.noteStress.value = '';
				this.noteFitness.value = '';
				this.noteComments.value = '';
				this.noteWater.value = '';
				this.noteSleep.value = '';
				this.sidebar.classList.toggle('show');
			})
			.catch(err => {
				console.log(err);
			});
	}
		showLoginModal(e) {
		e.preventDefault();
		this.loginModal.classList.add('show');
		this.toggleOverlay.call(this);
	}
	loginUser(e) {
		e.preventDefault();
		const user = {
			email: this.userEmail.value,
			password: this.userPassword.value
		}
		firebase.auth()
			.signInWithEmailAndPassword(user.email,user.password)
			.then((res) => {
				this.loginModal.classList.remove('show');
				this.toggleOverlay.call(this);
			})
			.catch((err) => {
				alert(err.message);
			});
	}
	createModal(e) {
		e.preventDefault();
		this.createUserModal.classList.add('show');
		this.toggleOverlay.call(this);
	}
	createUser(e) {
		e.preventDefault();

		const user = {
			email: this.createEmail.value,
			password: this.createPassword.value,
			confirm: this.confirmPassword.value
		};
		if(user.confirm !== user.password) {
			alert('Please make sure your passwords match.');
			return;
		}
		firebase.auth()
			.createUserWithEmailAndPassword(user.email,user.password)
			.then((res) => {
				this.createUserModal.classList.remove('show');
				this.toggleOverlay.call(this);
			})
			.catch((err) => {
				alert(err.message)
			});

	}
	removeNote(key) {
		const currentUser = firebase.auth().currentUser;
		const objRef = firebase.database().ref(`users/${currentUser.uid}/notes/${key}`);
		objRef.remove();
	}

	handleSubmit(e) {
		e.preventDefault();
		dbRef.push({
			blg: this.state.blg,
			food: this.state.food,
			water: this.state.water,
			sleep: this.state.sleep,
			fitness: this.state.fitness,
			stress: this.state.stress,
			comments: this.state.comments,
			date: this.state.date,
		});
		this.setState({
			currentUserInput: '',
		});
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	removeUserInput(key) {
		const inputRef = firebase.database().ref(key);
		inputRef.remove();
	}

    render() {
        return (
            <div>
            <main>
				<button className="log-button" href="" onClick={(e) => this.toggleAddNote.call(this,e)}>Submit Log</button>

                <section className="notes" >
					{/* this.state.notes.map((note,i) => <NoteCard note={note} key={note.key} removeNote={this.removeNote} />) */}
				</section>
				<aside ref={ref => this.sidebar = ref} className="sidebar wrapper">
					<h3>Hello! Here is your daily log:</h3>
					<form onSubmit={(e) => this.addNew.call(this,e)}>
						<i className="fa fa-times" onClick={e => this.toggleAddNote.call(this,e)}></i>

						<label htmlFor="date">Today's date: </label>
						<input type="date" name="note-date" ref={ref => this.noteDate = ref}/>

						<label htmlFor="blg">Enter your blood glucose level here: </label>
						<input type="text" name="note-title" placeholder="Ex. mg/dl" ref={ref => this.noteTitle = ref}/>

						<label htmlFor="food">Enter your meals here: </label>
						<textarea name="note-text" placeholder="Ex. Lunch: 3 fish tacos" ref={ref => this.noteText = ref}></textarea>

						<label htmlFor="note-water">Enter your water intake here: </label>
						<input name="note-water" type="number" placeholder="Ex. 7 glasses of water" ref={ref => this.noteWater = ref}/>

						<label htmlFor="note-fitness">Were you active today? If so, what did you do for exercise? </label>
						<input name="note-fitness" type="text" placeholder="Ex. Jogged for 30 minutes" ref={ref => this.noteFitness = ref}/>

						<label htmlFor="note-sleep"> How many hours of sleep did you get last night? </label>
						<input name="note-sleep" type="number" placeholder="Ex. 9 hours" ref={ref => this.noteSleep = ref}/>

						<label htmlFor="note-stress">On a scale of 1-100, how stressed were you today? </label>
						<input name="note-stress" type="range" min="Not stressed" max="Very stressed" step="10" ref={ref => this.noteStress = ref}/>
						
						<label htmlFor="note-comments">Additional Notes: </label>
						<textarea name="note-comments" placeholder="Ex. Felt lightheaded at 5pm." ref={ref => this.noteComments = ref}></textarea>
						<input type="submit"/>
					</form>
				</aside>
				<div className="overlay" ref={ref => this.overlay = ref}></div>
				<div className="loginModal modal" ref={ref => this.loginModal = ref}>
					<form action="" onSubmit={e => this.loginUser.call(this,e)}>
						<div>
							<label htmlFor="email">Email:</label>
							<input type="text" name="email" ref={ref => this.userEmail = ref}/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input type="password" name="password" ref={ref => this.userPassword = ref}/>
						</div>
						<div>
							<input type="submit"/>
						</div>
					</form>
				</div>

				<div className="calendar wrapper">
					<Calendar notes={this.state.notes} />
				</div>
			</main>
            </div>
        )
    }
}
