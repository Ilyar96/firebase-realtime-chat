import React, { useContext, useEffect, useState } from "react";
import { ChatItem } from "./ChatItem";
import { db } from "../firebase";
import { USER_CHATS_COLLECTION_PATH } from "../utils/const";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext, doChangeUser } from "../context/ChatContext";
import { getRelativeTimeString } from "../utils/getRelativeTimeString";

export const Chats = () => {
	const [chatList, setChatList] = useState([]);
	const { currentUser } = useContext(AuthContext);
	const { chatData, dispatch } = useContext(ChatContext);
	console.log("chatList: ", chatList);

	const getChats = async () => {
		try {
			const unsub = onSnapshot(
				doc(db, USER_CHATS_COLLECTION_PATH, currentUser.uid),
				(doc) => {
					const chats = doc.data();
					const chatsList = [];

					for (const key in chats) {
						if (Object.hasOwnProperty.call(chats, key)) {
							const chat = chats[key];
							chatsList.push({
								id: key,
								...chat,
							});
						}
					}

					chatsList.sort((a, b) => {
						if (!a.date || !b.date) return 1;
						return b.date.seconds - a.date.seconds;
					});

					setChatList(chatsList);
				}
			);

			return () => {
				unsub();
			};
		} catch (err) {
			console.log(err);
		}
	};

	const handleClick = (user) => {
		chatData.user?.uid !== user.uid && dispatch(doChangeUser(user));
	};

	const handleKeyDown = (e, user) => {
		if (e.code === "Enter") {
			handleClick(user);
		}
	};

	useEffect(() => {
		currentUser && getChats();
		// eslint-disable-next-line
	}, [currentUser]);

	const chatListLayout = chatList.map(({ id, userInfo, text = "", date }) => (
		<ChatItem
			key={id}
			tabIndex={0}
			date={date ? getRelativeTimeString(date.seconds * 1000, "en") : null}
			data={{
				text,
				...userInfo,
			}}
			onClick={() => handleClick(userInfo)}
			onKeyDown={(e) => handleKeyDown(e, userInfo)}
		/>
	));

	return <div className="chats">{chatListLayout}</div>;
};
