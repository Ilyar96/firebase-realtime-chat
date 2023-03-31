import React, { useContext, useEffect, useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase";
import AddAvatar from "../img/addAvatar.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
	LOGIN_ROUTE,
	HOME_ROUTE,
	USERS_COLLECTION_PATH,
	USER_CHATS_COLLECTION_PATH,
} from "../utils/const";
import { errorHandler } from "../utils/errorHandler";
import { AuthContext } from "../context/AuthContext";

const circleRad = 12;
const getCircleStrokeDashoffsetValueByPercent = (percent = 0) => {
	const strokeDashoffset = 2 * 3.14 * circleRad;
	return strokeDashoffset - (strokeDashoffset * percent) / 100;
};

export const Register = () => {
	// TODO validation, file loading status
	const [circleStrokeDashoffset, setCircleStrokeDashoffset] = useState(() =>
		getCircleStrokeDashoffsetValueByPercent()
	);
	const [isFileUploading, setIsFileUploading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const nameRef = useRef(null);
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	const setUserDataToDb = async (user, ...data) => {
		console.log("data: ", data);
		await setDoc(doc(db, USERS_COLLECTION_PATH, user.uid), {
			uid: user.uid,
			...data,
		});
		await setDoc(doc(db, USER_CHATS_COLLECTION_PATH, user.uid), {});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (isLoading) {
			return;
		}

		const displayName = e.target[0].value;
		console.log("displayName: ", displayName);
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];

		setIsLoading(true);

		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			).catch((error) => {
				errorHandler(error);
			});

			if (!file) {
				await setUserDataToDb(user, {
					displayName,
					email,
					photoURL: null,
				});

				await updateProfile(user, {
					displayName,
				});

				navigate(HOME_ROUTE, { replace: true });
				return;
			}

			setIsFileUploading(true);
			const storageRef = ref(storage, displayName.trim().replaceAll(" ", "-"));
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					setCircleStrokeDashoffset(
						getCircleStrokeDashoffsetValueByPercent(progress)
					);
				},
				(error) => {
					errorHandler(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
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

							navigate(HOME_ROUTE, { replace: true });
						} catch (error) {
							errorHandler(error);
							setIsLoading(false);
						}
					});
				}
			);
		} catch (error) {
			errorHandler(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		nameRef.current?.focus();
	}, []);

	if (currentUser?.displayName) {
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

					{!isFileUploading ? (
						<label htmlFor="file" className="label">
							<img src={AddAvatar} alt="" />
							<span>Add an avatar</span>
						</label>
					) : (
						<div className="label">
							<svg width="32px" height="32px">
								<circle
									r={circleRad}
									cx="50%"
									cy="50%"
									fill="transparent"
									stroke="#d0d6ea"
									strokeWidth={3}
								/>
								<circle
									r={circleRad}
									cx="50%"
									cy="50%"
									fill="transparent"
									stroke="#7b96ec"
									strokeWidth={3}
									style={{
										strokeDasharray: `${2 * 3.14 * circleRad}px`,
										strokeDashoffset: `${circleStrokeDashoffset}px`,
									}}
								/>
							</svg>
							<span>Uploading</span>
						</div>
					)}
					<button type="submit" disabled={isLoading}>
						Sign up
					</button>
				</form>
				<p>
					You do have an account? <Link to={LOGIN_ROUTE}>Login</Link>
				</p>
			</div>
		</div>
	);
};
