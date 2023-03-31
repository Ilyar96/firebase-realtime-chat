import React, { useContext, useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { ChatContext } from "../context/ChatContext";
import { errorHandler } from "../utils/errorHandler";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { CHATS_COLLECTION_PATH } from "../utils/const";

export const Messages = () => {
	const [messages, setMessages] = useState([]);
	const [isScrolled, setIsScrolled] = useState(false);
	const { chatData } = useContext(ChatContext);
	const chatID = chatData.chatID;
	const lastMessageRef = useRef(null);

	const getMessages = async () => {
		try {
			const unsub = onSnapshot(
				doc(db, CHATS_COLLECTION_PATH, chatID),
				(doc) => {
					const res = doc.data();
					res ? setMessages(res.messages) : setMessages([]);
				}
			);

			return () => {
				unsub();
			};
		} catch (err) {
			errorHandler(err);
		}
	};

	useEffect(() => {
		chatID && getMessages();
		console.log("chatId: ", chatID);
		setIsScrolled(false);
	}, [chatID]);

	useEffect(() => {
		if (messages.length > 0 && !isScrolled) {
			const timer = setTimeout(function () {
				lastMessageRef.current.scrollIntoView();
				setIsScrolled(true);
			}, 150);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [messages, chatID]);

	if (!chatID) {
		return (
			<div className="messages empty">
				Choose who you would like to write to
			</div>
		);
	}

	return (
		<div className="messages">
			{messages.map((m, i) => {
				let ref = undefined;
				if (messages.length - 1 === i) {
					ref = lastMessageRef;
				}
				return <Message message={m} key={m.id} ref={ref} />;
			})}
		</div>
	);
};
