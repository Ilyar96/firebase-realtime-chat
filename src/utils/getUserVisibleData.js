export const getUserVisibleData = (user) => {
	return {
		uid: user.uid,
		displayName: user.displayName,
		photoURL: user.photoURL,
	};
};
