import React, { useContext, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { REGISTER_ROUTE, HOME_ROUTE } from "../utils/const";
import { auth } from "../firebase";
import { authErrorHandler } from "../utils/authErrorHandler";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
	const emailRef = useRef(null);
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const email = e.target[0].value;
		const password = e.target[1].value;

		signInWithEmailAndPassword(auth, email, password).catch((error) => {
			authErrorHandler(error);
		});
		navigate(HOME_ROUTE, { replace: true });
	};

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	if (currentUser) {
		return <Navigate to={HOME_ROUTE} replace />;
	}

	return (
		<div className="form-container">
			<div className="form-wrapper">
				<span className="logo">Chat</span>
				<span className="title">login</span>
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="email" ref={emailRef} />
					<input type="password" placeholder="password" />
					<button>Sign in</button>
				</form>
				<p>
					You don`t have an account? <Link to={REGISTER_ROUTE}>Register</Link>
				</p>
			</div>
		</div>
	);
};
