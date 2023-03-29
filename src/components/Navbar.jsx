import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";

export const Navbar = () => {
	const logout = () => {
		signOut(auth);
	};

	return (
		<div className="navbar">
			<span className="logo">Chat</span>
			<div className="user">
				<img src="http://iljar96.ru/images/users/male_01.jpg" alt="" />
				<span>displayName</span>
				<button onClick={logout}>logout</button>
			</div>
		</div>
	);
};
