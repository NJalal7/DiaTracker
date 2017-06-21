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
				<p>In addition to your blood glucose, you can track your food and water intake, stress level, sleep, exercise activity, and even journal!</p>
				<p> Your daily entries are securely stored and may be retrieved and shared with your care team at any time.</p>  
				<h2>To get started: </h2>
				<p>1. Click "Create User" to create an account.</p>
				<p>2. Sign in to your account.</p>    
				<p>3. Go to your personal dashboard to start tracking parameters and better managing your diabetes.</p>
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
			loggedIn: false
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
				this.setState({
					loggedIn: true
				})
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
						{!this.state.loggedIn ? 
							<button href="" onClick={(e) => this.showLoginModal.call(this,e)}>Sign in</button>
							:
							<button class="dashboard"><Link to="/dashboard">Go to Dashboard</Link></button>
						}
						<button href="" onClick={(e) => this.createModal.call(this,e)}>Create User</button>
					</nav>

				</header>
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
				<Route exact path="/" component={Home} />
				<Route exact path="/dashboard" component={Dashboard} />
			</div>
			</Router>
		)
	}
}

App.contextTypes = {
	router: React.PropTypes.shape({
		history: React.PropTypes.object.isRequired
	}),
};

ReactDOM.render(<App />, document.getElementById('app'));






