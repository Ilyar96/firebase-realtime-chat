import React, { useContext } from "react";
import More from "../img/more.png";
import { Messages } from "./Messages";
import { Input } from "./Input";
import { ChatContext } from "../context/ChatContext";

export const Chat = () => {
	const { chatData } = useContext(ChatContext);

	return (
		<div className="chat">
			<div className="chat-info">
				<span>{chatData.user?.displayName}</span>
				<div className="chat-icons">
					<img src={More} alt="" />
				</div>
			</div>
			<Messages />
			{chatData.chatID && <Input />}
		</div>
	);
};
