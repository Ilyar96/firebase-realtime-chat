import React, { useState, useEffect, useCallback, useContext } from "react";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import debounce from "lodash.debounce";
import { db } from "../firebase";
import { ChatItem } from "./ChatItem";
import { findByValue } from "../utils/findByValue";
import { errorHandler } from "../utils/errorHandler";
import {
	USERS_COLLECTION_PATH,
	CHATS_COLLECTION_PATH,
	USER_CHATS_COLLECTION_PATH,
} from "../utils/const";
import { AuthContext } from "../context/AuthContext";
import { getUserVisibleData } from "../utils/getUserVisibleData";

export const Search = () => {
	const [searchValue, setSearchValue] = useState("");
	const [userList, setUserList] = useState([]);
	const [err, setErr] = useState(null);
	const { currentUser } = useContext(AuthContext);

	const onChange = (e) => {
		setSearchValue(e.target.value);
	};

	const handleSearch = async (value) => {
		try {
			const querySnapshot = await getDocs(
				collection(db, USERS_COLLECTION_PATH)
			);

			if (!value) {
				setErr(null);
				setUserList([]);
				return;
			}

			const filteredUserList = [];
			querySnapshot.forEach((doc) => {
				const { 0: userData, uid } = doc.data();

				if (userData && findByValue(userData.displayName, value)) {
					filteredUserList.push({ uid, ...userData });
				}
			});

			setUserList(filteredUserList);
			setErr(null);

			if (filteredUserList.length === 0) {
				setErr(true);
			}
		} catch (error) {
			errorHandler(error);
		}
	};

	const handleSelect = async (user) => {
		//check whether the group (chats in firestore) exists, if not create
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: currentUser.uid + user.uid;

		try {
			const res = await getDoc(doc(db, CHATS_COLLECTION_PATH, combinedId));

			if (!res.exists()) {
				//create chat in chats collection
				const chatRef = doc(db, CHATS_COLLECTION_PATH, combinedId);
				await setDoc(chatRef, {
					messages: [],
				});

				//update currentUser chats
				const currentUserChatsRef = doc(
					db,
					USER_CHATS_COLLECTION_PATH,
					currentUser.uid
				);
				await updateDoc(currentUserChatsRef, {
					[`${combinedId}.userInfo`]: getUserVisibleData(user),
					[`${combinedId}.date`]: serverTimestamp(),
				});

				//update selected user chats
				const userChatsRef = doc(db, USER_CHATS_COLLECTION_PATH, user.uid);
				await updateDoc(userChatsRef, {
					[`${combinedId}.userInfo`]: getUserVisibleData(currentUser),
					[`${combinedId}.date`]: serverTimestamp(),
				});
			}
		} catch (err) {
			console.log(err);
		}

		setUserList([]);
		setSearchValue("");
	};

	// eslint-disable-next-line
	const debouncedSearch = useCallback(debounce(handleSearch, 300), []);
	// eslint-disable-next-line
	const debouncedSelect = useCallback(debounce(handleSelect, 300), []);

	useEffect(() => {
		debouncedSearch(searchValue);
		// eslint-disable-next-line
	}, [searchValue]);

	return (
		<div className="search">
			<div className="search-form">
				<input
					type="text"
					placeholder="Find a user"
					value={searchValue}
					onChange={onChange}
				/>
			</div>
			{err && <span className="not-found">User not found!</span>}
			{userList.length > 0 &&
				userList.map((user) => (
					<ChatItem
						key={user.uid}
						data={getUserVisibleData(user)}
						onClick={() => debouncedSelect(user)}
						withoutText
						tabIndex={0}
					/>
				))}
		</div>
	);
};
