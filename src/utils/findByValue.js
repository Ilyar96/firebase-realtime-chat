export const findByValue = (baseStr, value) => {
	return baseStr.toLowerCase().indexOf(value.toLowerCase()) !== -1;
};
