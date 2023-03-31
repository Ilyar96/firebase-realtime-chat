import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import "normalize.css";
import "./style.scss";
import { ChatContextProvider } from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<AuthContextProvider>
			<ChatContextProvider>
				<App />
			</ChatContextProvider>
		</AuthContextProvider>
	</React.StrictMode>
);
