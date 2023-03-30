import React from "react";

export const ChatItem = ({ data, withoutText, ...props }) => {
	return (
		<div className="user-chat" {...props}>
			<img src={data.photoURL} alt="displayName" />
			<div className="user-chat-info">
				<span>{data.displayName}</span>
				{!withoutText && <p>{data.text}</p>}
			</div>
		</div>
	);
};
