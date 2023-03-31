import React, { forwardRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import emptyAvatar from "../img/empty-avatar.png";
import { getRelativeTimeString } from "../utils/getRelativeTimeString";

export const Message = forwardRef(({ message }, ref) => {
	const { currentUser } = useContext(AuthContext);
	const { chatData } = useContext(ChatContext);
	const image =
		chatData.user.uid === Message.senderId
			? chatData.user.photoURL
			: currentUser.photoURL;

	return (
		<div
			className={`message ${
				message.senderID === currentUser.uid ? "owner" : ""
			}`}
			ref={ref}
		>
			<div className="message-info">
				<img
					src={image ? image : emptyAvatar}
					alt={chatData.user?.displayName}
				/>
			</div>
			<div className="message-content">
				{message.text && <p>{message.text}</p>}
				{message.img && <img src={message.img} alt="" />}
				<span className="date">
					{getRelativeTimeString(message.date.seconds * 1000, "en")}
				</span>
			</div>
		</div>
	);
});
