import React, { useContext, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import AddAvatar from "../img/addAvatar.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, HOME_ROUTE } from "../utils/const";
import { authErrorHandler } from "../utils/authErrorHandler";
import { AuthContext } from "../context/AuthContext";

export const Register = () => {
	// TODO validation, file loading status
	const nameRef = useRef(null);
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	const setUserDataToDb = async (user, ...data) => {
		await setDoc(doc(db, "users", user.uid), {
			uid: user.uid,
			...data,
		});
		await setDoc(doc(db, "userChats", user.uid), {});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (res) => {
				const user = res.user;

				if (!file) {
					await setUserDataToDb(user, {
						displayName,
						email,
						photoURL: null,
					});
					navigate(HOME_ROUTE, { replace: true });
					return;
				}

				const storageRef = ref(
					storage,
					displayName.trim().replaceAll(" ", "-")
				);
				const uploadTask = uploadBytesResumable(storageRef, file);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");

						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
							default:
								break;
						}
					},
					(error) => {
						authErrorHandler(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(
							async (downloadURL) => {
								try {
									console.log("File available at", downloadURL);
									//Update profile
									await updateProfile(user, {
										displayName,
										photoURL: downloadURL,
									});

									setUserDataToDb(user, {
										displayName,
										email,
										photoURL: downloadURL,
									});
								} catch (error) {
									authErrorHandler(error);
								}
							}
						);
					}
				);

				navigate(HOME_ROUTE, { replace: true });
			})
			.catch((error) => {
				authErrorHandler(error);
			});
	};

	useEffect(() => {
		nameRef.current?.focus();
	}, []);

	if (currentUser) {
		return <Navigate to={HOME_ROUTE} replace />;
	}

	return (
		<div className="form-container">
			<div className="form-wrapper">
				<span className="logo">Chat</span>
				<span className="title">register</span>
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="display name" ref={nameRef} />
					<input type="email" placeholder="email" />
					<input type="password" placeholder="password" />
					<input type="file" id="file" hidden />
					<label htmlFor="file">
						<img src={AddAvatar} alt="" />
						<span>Add an avatar</span>
					</label>
					<button type="submit">Sign up</button>
				</form>
				<p>
					You do have an account? <Link to={LOGIN_ROUTE}>Login</Link>
				</p>
			</div>
		</div>
	);
};
