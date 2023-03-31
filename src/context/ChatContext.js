import { createContext, useContext, useReducer } from "react";
import { getCombinedId } from "../utils/getCombinedId";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
const CHANGE_USER = "CHANGE_USER";

const initialState = {
	chatID: null,
	user: null,
};

export const ChatContextProvider = ({ children }) => {
	const { currentUser } = useContext(AuthContext);

	const chatReducer = (state, action) => {
		switch (action.type) {
			case CHANGE_USER:
				return {
					user: action.payload,
					chatID: getCombinedId(currentUser.uid, action.payload.uid),
				};
			default:
				return state;
		}
	};

	const [state, dispatch] = useReducer(chatReducer, initialState);

	return (
		<ChatContext.Provider value={{ chatData: state, dispatch }}>
			{children}
		</ChatContext.Provider>
	);
};

export const doChangeUser = (payload) => ({ type: CHANGE_USER, payload });
