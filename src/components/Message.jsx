import React from "react";

export const Message = ({ message }) => {
	return (
		<div
			className={`message`}
			// className={`message ${message.senderId === currentUser.uid && "owner"}`}
		>
			<div className="message-info">
				<img src="http://iljar96.ru/images/users/male_01.jpg" alt="" />
				<span>just now</span>
			</div>
			<div className="message-content">
				<p>{message.text}</p>
				{message.img && <img src={message.img} alt="" />}
			</div>
		</div>
	);
};
