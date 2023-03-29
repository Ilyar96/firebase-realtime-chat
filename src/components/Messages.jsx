import React from "react";
import { Message } from "./Message";

const messages = [
	{
		id: 1,
		text: "text",
		img: "",
		senderId: 1,
	},
	{
		id: 2,
		text: "myText",
		img: "",
		senderId: 2,
	},
];

export const Messages = () => {
	return (
		<div className="messages">
			{messages.map((m) => (
				<Message message={m} key={m.id} />
			))}
		</div>
	);
};
