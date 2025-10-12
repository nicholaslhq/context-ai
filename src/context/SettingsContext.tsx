"use client";

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";
import { loadFromLocalStorage } from "@/utils/localStorage";

interface SettingsContextType {
	isApiKeyComplete: boolean;
	setIsApiKeyComplete: (complete: boolean) => void;
	isModelSelectedComplete: boolean;
	setIsModelSelectedComplete: (complete: boolean) => void;
	isDocumentUploadedComplete: boolean;
	setIsDocumentUploadedComplete: (complete: boolean) => void;
	areAllSettingsComplete: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
	undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [isApiKeyComplete, setIsApiKeyComplete] = useState(false);
	const [isModelSelectedComplete, setIsModelSelectedComplete] =
		useState(false);
	const [isDocumentUploadedComplete, setIsDocumentUploadedComplete] =
		useState(false);

	useEffect(() => {
		// Initial check for API key
		const storedApiKey = loadFromLocalStorage("geminiApiKey");
		setIsApiKeyComplete(!!storedApiKey);

		// Initial check for selected model
		const storedModel = loadFromLocalStorage("geminiSelectedModel");
		setIsModelSelectedComplete(!!storedModel);

		// Document upload completeness will be managed by DocumentUpload component
	}, []);

	const areAllSettingsComplete =
		isApiKeyComplete &&
		isModelSelectedComplete &&
		isDocumentUploadedComplete;

	return (
		<SettingsContext.Provider
			value={{
				isApiKeyComplete,
				setIsApiKeyComplete,
				isModelSelectedComplete,
				setIsModelSelectedComplete,
				isDocumentUploadedComplete,
				setIsDocumentUploadedComplete,
				areAllSettingsComplete,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
