import React from "react";

export const Search = () => {
	const err = false;
	const user = false;
	return (
		<div className="search">
			<div className="search-form">
				<input type="text" placeholder="Find a user" />
			</div>
			{err && <span>User not found!</span>}
			{user && (
				<div className="user-chat">
					<img src="http://iljar96.ru/images/users/male_01.jpg" alt="" />
					<div className="user-chatinfo">
						<span>displayName</span>
					</div>
				</div>
			)}
		</div>
	);
};
