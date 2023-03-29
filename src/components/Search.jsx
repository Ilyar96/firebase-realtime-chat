import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import debounce from "lodash.debounce";
import { db } from "../firebase";
import { ChatItem } from "./ChatItem";
import { findByValue } from "../utils/findByValue";

export const Search = () => {
	const [searchValue, setSearchValue] = useState("");
	const [userList, setUserList] = useState([]);
	const [err, setErr] = useState(null);

	const onChange = (e) => {
		setSearchValue(e.target.value);
	};

	const handleSearch = async (value) => {
		const querySnapshot = await getDocs(collection(db, "users"));

		if (!value) {
			setErr(false);
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

		if (filteredUserList.length === 0) {
			setErr(true);
		}
	};

	// eslint-disable-next-line
	const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

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
						data={{
							text: "test",
							...user,
						}}
						withoutText
					/>
				))}
		</div>
	);
};
