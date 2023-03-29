import { toast } from "react-toastify";

const options = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "dark",
};

export const notify = (message) => toast(message, options);
export const notifyInfo = (message) => toast.info(message, options);
export const notifyWarning = (message) => toast.warn(message, options);
export const notifySuccess = (message) => toast.success(message, options);
export const notifyError = (message) => toast.error(message, options);
