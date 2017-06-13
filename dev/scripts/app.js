import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './noteCard.js';
import Calendar from './calendar.js';


//This initializes the Firebase database
var config = {
    apiKey: "AIzaSyDX4xlM88OYmOuNOHWbiIqcLFDU-7rnwhM",
    authDomain: "diatracker.firebaseapp.com",
    databaseURL: "https://diatracker.firebaseio.com",
    projectId: "diatracker",
    storageBucket: "diatracker.appspot.com",
    messagingSenderId: "743066598077"
  };

firebase.initializeApp(config);

// const auth = firebase.auth();
// const provider = new firebase.auth.GoogleAuthProvider();
// const dbRef = firebase.database().ref('/');

class App extends React.Component {
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
			title: this.noteTitle.value,
			text: this.noteText.value
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
				this.noteTitle.value = '';
				this.noteText.value = '';
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
			alert('Please make sure you passwords match.');
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
		return(
			<main>
			<header className="mainHeader">
				<h1> DiaTracker 💉</h1>
				<h3> A diabetes management app. </h3>
					<nav>
						<a href="" onClick={(e) => this.toggleAddNote.call(this,e)}>My Log</a>
						<a href="" onClick={(e) => this.showLoginModal.call(this,e)}>Sign in</a>
						<a href="" onClick={(e) => this.createModal.call(this,e)}>Create Account</a>
					</nav>
				</header>
				<section className="notes">
					{this.state.notes.map((note,i) => <NoteCard note={note} key={note.key} removeNote={this.removeNote} />)}
				</section>
				<aside ref={ref => this.sidebar = ref} className="sidebar">
					<h3>Hi, userName. Here's your log for currentDate.</h3>
					<form onSubmit={(e) => this.addNew.call(this,e)}>
						<i className="fa fa-times" onClick={e => this.toggleAddNote.call(this,e)}></i>
						<input type="text" name="note-title" ref={ref => this.noteTitle = ref}/>
						<textarea name="note-text" ref={ref => this.noteText = ref}></textarea>

						<label htmlFor="blg">Enter your blood glucose level here: </label>
						<input className="questions" name="blg" value={this.state.blg} onChange={this.handleChange} type="text" placeholder="Ex. mg/dl" />

						<label htmlFor="food">Enter your meals here: </label>
						<input className="questions" name="food" value={this.state.food} onChange={this.handleChange} type="text" placeholder="Ex. Lunch: 3 fish tacos" />

						<label htmlFor="water">Enter your water intake here: </label>
						<input className="questions" name="water" value={this.state.water} onChange={this.handleChange} type="number" placeholder="Ex. 7 glasses of water" />

						<label htmlFor="fitness">Were you active today? If so, what did you do for exercise? </label>
						<input className="questions" name="fitness" value={this.state.fitness} onChange={this.handleChange} type="text" placeholder="Ex. Jogged for 30 minutes" />

						<label htmlFor="sleep"> How many hours of sleep did you get last night? </label>
						<input className="questions" name="sleep" value={this.state.sleep} onChange={this.handleChange} type="number" placeholder="Ex. 9 hours" />

						<label htmlFor="stress">On a scale of 1-100, how stressed were you today? </label>
						<input className="questions" name="stress" value={this.state.stress} onChange={this.handleChange} type="range" min="Not stressed" max="Very stressed" step="10" />

						<label htmlFor="comments">Additional Notes: </label>
						<textarea className="questions" name="comments" value={this.state.comments} onChange={this.handleChange} type="text" placeholder="Ex. Felt lightheaded at 5pm. "> </textarea>
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
				<div className="createUserModal modal" ref={ref => this.createUserModal = ref}>
					<form action="" onSubmit={e => this.createUser.call(this,e)}>
						<div>
							<label htmlFor="createEmail">Email:</label>
							<input type="text" name="createEmail" ref={ref => this.createEmail = ref}/>
						</div>
						<div>
							<label htmlFor="createPassword">Password:</label>
							<input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
						</div>
						<div>
							<label htmlFor="confirmPassword">Confirm Password:</label>
							<input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
						</div>
						<div>
							<input type="submit"/>
						</div>
					</form>
				</div>
			</main>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('app'));




