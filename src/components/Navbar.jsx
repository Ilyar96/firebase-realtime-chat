import { signOut } from "firebase/auth";
import React from "react";
import { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import emptyAvatar from "../img/empty-avatar.png";

export const Navbar = () => {
	const { currentUser } = useContext(AuthContext);
	const avatar = currentUser.photoURL ? currentUser.photoURL : emptyAvatar;

	const logout = () => {
		signOut(auth);
	};

	return (
		<div className="navbar">
			<span className="logo">Chat</span>
			<div className="user">
				<img src={avatar} alt="" />
				<span>{currentUser.displayName}</span>
				<button onClick={logout}>logout</button>
			</div>
		</div>
	);
};
