import React from "react";
import emptyAvatar from "../img/empty-avatar.png";

export const ChatItem = ({ data, withoutText, date, ...props }) => {
	console.log("date: ", date);
	return (
		<div className="user-chat" {...props}>
			<img
				src={data.photoURL ? data.photoURL : emptyAvatar}
				alt={data.displayName}
			/>
			<div className="user-chat-info">
				<span>{data.displayName}</span>
				{!withoutText && data.text && <p>{data.text}</p>}
			</div>
			{date && <div className="chat-date">{date}</div>}
		</div>
	);
};
