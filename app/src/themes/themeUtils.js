export const removeColorFromArray = (array, color) => {
    const index = array.indexOf(color);
    array.splice(index, 1);
    return array;
}

export const reverseContrastColors = (colors) => {
	const reversed = {
		...colors,
		primaryContrastA: colors.primaryContrastB,
		primaryContrastB: colors.primaryContrastA,
		secondaryContrastA: colors.secondaryContrastB,
		secondaryContrastB: colors.secondaryContrastA,
	}
	return reversed
}