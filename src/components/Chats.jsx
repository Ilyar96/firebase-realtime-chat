import React from "react";
import { ChatItem } from "./ChatItem";

export const Chats = () => {
	return (
		<div className="chats">
			<ChatItem
				data={{
					displayName: "Alex",
					photoURL: "http://iljar96.ru/images/users/male_01.jpg",
					text: "text",
				}}
			/>
			<ChatItem
				data={{
					displayName: "Alex",
					photoURL: "http://iljar96.ru/images/users/male_01.jpg",
					text: "text",
				}}
			/>
		</div>
	);
};
