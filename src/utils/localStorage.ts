export const saveToLocalStorage = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch (error) {
		console.error("Error saving to local storage:", error);
	}
};

export const loadFromLocalStorage = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error("Error loading from local storage:", error);
		return null;
	}
};

export const removeFromLocalStorage = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error("Error removing from local storage:", error);
	}
};
