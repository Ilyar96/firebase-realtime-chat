import React from "react";

export const ChatItem = ({ data, withoutText }) => {
	return (
		<div className="user-chat">
			<img src={data.photoURL} alt="displayName" />
			<div className="user-chat-info">
				<span>{data.displayName}</span>
				{!withoutText && <p>{data.text}</p>}
			</div>
		</div>
	);
};
