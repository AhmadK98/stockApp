import React, { useState, useEffect } from "react";
import Dashboard from "./components/stocks/Dashboard";
import LoginForm from "./components/login/LoginForm";
import Loading from "./components/loading/Loading";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import "./App.css";

function App() {
	const [logged, setLogged] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [serve, setServe] = useState();

	let initialize = async () => {
		try {
			let res = await fetch("/users/loggedin", {
				credentials: "include",
			});
			let data = await res.json();
			return data;
		} catch {
			let data = "Cannot log in";
			return data;
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			initialize().then((data) => {
				setLogged(data == "true");
				setLoaded(true);
				clearInterval(interval);
			});
		}, 1000);
	}, []);

	// useEffect(() => {
	// 	if (logged == true) {
	// 		setServe(<Home />);
	// 	} else {
	// 		setServe(<LoginForm />);
	// 	}
	// }, [logged]);

	const PrivateRoute = ({ component: Component, ...rest }) => (
		
		initialize().then((data) => setLogged(data == "true")),
	
		(<Route {...rest} render={(props) => (logged == true ? <Component {...props} /> : <Redirect to="/login" />)} />)
	);

	if (3 == 5) {
		//change to loaded === false
		return (
			<div className="App">
				<header className="App-header">
					<Loading />
				</header>
			</div>
		);
	} else {
		return (
			<div className="App">
				<header className="App-header">
					<Router>
						<Navbar loggedIn={logged}/>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/login" component={LoginForm} />
							<Route path="/dash" component={Dashboard} />
						</Switch>
					</Router>
				</header>
			</div>
		);
	}
}

export default App;
