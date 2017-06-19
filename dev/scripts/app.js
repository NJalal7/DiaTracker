import React from 'react';
import ReactDOM from 'react-dom';
import NoteCard from './noteCard.js';
import Calendar from './calendar.js';
import { 
	BrowserRouter as Router, 
	Route, Link } from 'react-router-dom';
import Dashboard from './dashboard.js';

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

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const dbRef = firebase.database().ref('/');

class Home extends React.Component {
    render() {
        return (
            <div className="homepage">
               <h1>DiaTracker is a digital logging tool crafted to help you manage your diabetes.</h1>
               <button>Sign In</button>
               <button>Create Account</button>
            </div>
        )
    }
}

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
			date: "",
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
		return(
			<Router>
			<div>
			<header className="mainHeader clearfix">
				<h1> DiaTracker <i className="fa fa-heartbeat" aria-hidden="true"></i></h1>
				<h3> A diabetes management app. </h3>
					<nav>
						<button href="" onClick={(e) => this.showLoginModal.call(this,e)}>Sign in</button>
						<button href="" onClick={(e) => this.createModal.call(this,e)}>My Profile</button>
					</nav>
				</header>

				<Route exact path="/" component={Home} />
				<Route exact path="/dashboard" component={Dashboard} />
			</div>
			</Router>
		)
	}
}
ReactDOM.render(<App />, document.getElementById('app'));






