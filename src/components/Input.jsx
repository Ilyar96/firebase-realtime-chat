import React, { useContext, useEffect, useRef, useState } from "react";
import {
	arrayUnion,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
	CHATS_COLLECTION_PATH,
	CHAT_MESSAGES_PATH,
	USER_CHATS_COLLECTION_PATH,
} from "../utils/const";
import { errorHandler } from "../utils/errorHandler";
import Img from "../img/img.png";

export const Input = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState();
	const { chatData } = useContext(ChatContext);
	const { currentUser } = useContext(AuthContext);
	const inputRef = useRef(null);

	const onChange = (e) => {
		console.log(e.target.name);
		switch (e.target.name) {
			case "text":
				setText(e.target.value);
				break;
			case "img":
				setImg(e.target.files[0]);
				break;

			default:
				break;
		}
	};

	const handleSend = async () => {
		try {
			const messagesRef = doc(db, CHATS_COLLECTION_PATH, chatData.chatID);
			const messageData = {
				id: uuidv4(),
				text: text,
				senderID: currentUser.uid,
				date: Timestamp.now(),
			};

			if (img) {
				const storageRef = ref(storage, uuidv4());
				const uploadTask = uploadBytesResumable(storageRef, img);

				await uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
					},
					(error) => {
						errorHandler(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then(
							async (downloadURL) => {
								messageData.img = downloadURL;
								await updateDoc(messagesRef, {
									[CHAT_MESSAGES_PATH]: arrayUnion(messageData),
								});
							}
						);
					}
				);
			} else {
				await updateDoc(messagesRef, {
					[CHAT_MESSAGES_PATH]: arrayUnion(messageData),
				});
			}

			const currentUserChatsRef = doc(
				db,
				USER_CHATS_COLLECTION_PATH,
				currentUser.uid
			);
			await updateDoc(currentUserChatsRef, {
				[`${chatData.chatID}.text`]: text,
				[`${chatData.chatID}.date`]: serverTimestamp(),
			});

			//update selected user chats
			const userChatsRef = doc(
				db,
				USER_CHATS_COLLECTION_PATH,
				chatData.user.uid
			);
			await updateDoc(userChatsRef, {
				[`${chatData.chatID}.text`]: text,
				[`${chatData.chatID}.date`]: serverTimestamp(),
			});

			setText("");
			setImg("");
		} catch (err) {
			console.log("err: ", err);
			errorHandler(err);
		}
	};

	const handleKeyDown = (e) => {
		if (e.code === "Enter") {
			handleSend();
		}
	};

	useEffect(() => {
		inputRef.current?.focus();
	}, [chatData.chatID]);

	return (
		<div className="input">
			<input
				type="text"
				name="text"
				placeholder="Type something..."
				value={text}
				onChange={onChange}
				onKeyDown={handleKeyDown}
				ref={inputRef}
			/>
			<div className="send">
				<input onChange={onChange} type="file" name="img" hidden id="img" />
				<label htmlFor="img">
					<img src={Img} alt="" />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
};
