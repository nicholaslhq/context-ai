"use client";

import { useState, useEffect } from "react";
import { UploadedFile } from "../components/DocumentUpload";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseDocument } from "../utils/documentParser";
import { GeminiModel } from "@/utils/geminiApi";
import { loadFromLocalStorage } from "@/utils/localStorage";
import MobileTabs from "@/components/MobileTabs";
import { useMediaQuery } from "@/lib/utils";
import DesktopSidebar from "@/components/DesktopSidebar";
import ChatWindow from "@/components/ChatWindow";
import MobileSettingsContent from "@/components/MobileSettingsContent";
import MobileChatContent from "@/components/MobileChatContent";
import QueryInput from "../components/QueryInput";

export default function Home() {
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [documents, setDocuments] = useState<File[]>([]);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // New state for uploaded files
	const [messages, setMessages] = useState<
		{
			id: string;
			text: string;
			sender: "user" | "ai";
			timestamp: string;
			loading?: boolean;
		}[]
	>([
		{
			id: "1",
			text: "Welcome to **Context AI**! ✨\n\nI'm your intelligent document assistant. Upload a file, and I'll help you extract insights, summarize content, and answer your questions instantly. Let's turn your documents into dialogue! \n\n _— Created by [Nicholas](https://nlhq.vercel.app/)_",
			sender: "ai",
			timestamp: new Date().toLocaleTimeString(),
		},
		{
			id: "2",
			text: "Please configure the following in the **Settings** panel:\n1. Enter your Gemini API key.\n2. Select a Gemini model.\n3. Upload your document.\n4. Ask me anything about the document!",
			sender: "ai",
			timestamp: new Date().toLocaleTimeString(),
		},
	]);
	const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
	const [selectedModel, setSelectedModel] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const storedApiKey = loadFromLocalStorage("geminiApiKey");
		if (storedApiKey) {
			setApiKey(storedApiKey);
		}
		const storedModel = loadFromLocalStorage("geminiSelectedModel");
		if (storedModel) {
			setSelectedModel(storedModel);
		}
	}, []);

	useEffect(() => {
		setDocuments(uploadedFiles.map((uf) => uf.file));
	}, [uploadedFiles]);

	const handleDocumentsUpload = () => {
		// This function is now primarily for triggering the upload process in DocumentUpload
		// The actual `documents` state will be updated via the useEffect when `uploadedFiles` changes.
	};

	const handleQuerySubmit = async (query: string) => {
		if (!apiKey) {
			alert("Please enter your Gemini API key first.");
			return;
		}
		if (documents.length === 0) {
			alert("Please upload documents first.");
			return;
		}

		const newUserMessage = {
			id: Date.now().toString(),
			text: query,
			sender: "user" as const,
			timestamp: new Date().toLocaleTimeString(),
		};
		setMessages((prevMessages) => [...prevMessages, newUserMessage]);
		setIsLoading(true);

		try {
			const genAI = new GoogleGenerativeAI(apiKey);
			const model = genAI.getGenerativeModel({
				model: selectedModel || "gemini-2.5-flash-preview-05-20", // Use selected model or default
			});

			const documentTexts = await Promise.all(
				documents.map(async (file) => {
					const content = await parseDocument(file);
					return `--- Document: ${file.name} ---\n${content}`;
				})
			);

			const prompt = `You are an AI assistant named Context AI. Your primary function is to extract information from provided documents and answer questions based solely on their content.

**Instructions:**
1.  First, determine if the user's question is directly related to the content of the provided documents.
2.  If the question is document-related:
			 *   Carefully read and understand the context provided by the documents below.
			 *   Answer the user's question accurately and concisely, drawing information exclusively from the provided documents.
			 *   If the answer to the question cannot be found within the provided documents, state clearly that the information is not available in the given context. Do not make up information.
3.  If the question is NOT document-related (e.g., "What can you do?", "Who are you?"):
			 *   Answer generally about your capabilities as Context AI, emphasizing your role in assisting with document analysis and information extraction.
			 *   Do not invent capabilities beyond your core function.
4.  Maintain a professional, helpful, and polite tone at all times.

**Provided Documents:**
${documentTexts.join("\n\n")}

**User Question:**
${query}`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			const newAiMessage = {
				id: Date.now().toString() + "-ai",
				text: text,
				sender: "ai" as const,
				timestamp: new Date().toLocaleTimeString(),
			};
			setMessages((prevMessages) => [...prevMessages, newAiMessage]);
		} catch (error) {
			console.error("Error querying Gemini API:", error);
			const errorMessage = {
				id: Date.now().toString() + "-error",
				text: "Error: Unable to get a response from Gemini API. Please check your API key and try again.",
				sender: "ai" as const,
				timestamp: new Date().toLocaleTimeString(),
			};
			setMessages((prevMessages) => [...prevMessages, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearChat = () => {
		setMessages([]);
	};

	const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind's 'md' breakpoint is 768px

	return (
		<div className="flex md:flex-row flex-col w-full md:h-full md:gap-2 md:p-4 md:overflow-hidden">
			{isDesktop ? (
				<>
					{/* Desktop layout */}
					<DesktopSidebar
						apiKey={apiKey}
						setApiKey={setApiKey}
						availableModels={availableModels}
						setAvailableModels={setAvailableModels}
						selectedModel={selectedModel}
						setSelectedModel={setSelectedModel}
						handleDocumentsUpload={handleDocumentsUpload}
						uploadedFiles={uploadedFiles}
						setUploadedFiles={setUploadedFiles}
					/>
					<div className="flex flex-col flex-1 h-full">
						<ChatWindow
							messages={messages}
							isLoading={isLoading}
							handleQuerySubmit={handleQuerySubmit}
							handleClearChat={handleClearChat}
							apiKey={apiKey}
							documents={documents}
							isChatHistoryEmpty={messages.length == 0}
						/>
					</div>
				</>
			) : (
				/* Mobile-only tabs */
				<MobileTabs
					settingsContent={
						<MobileSettingsContent
							apiKey={apiKey}
							setApiKey={setApiKey}
							availableModels={availableModels}
							setAvailableModels={setAvailableModels}
							selectedModel={selectedModel}
							setSelectedModel={setSelectedModel}
							handleDocumentsUpload={handleDocumentsUpload}
							uploadedFiles={uploadedFiles}
							setUploadedFiles={setUploadedFiles}
						/>
					}
					chatContent={
						<MobileChatContent
							messages={messages}
							isLoading={isLoading}
						/>
					}
					queryInput={
						<QueryInput
							onQuerySubmit={handleQuerySubmit}
							onClearChat={handleClearChat}
							disabled={
								!apiKey || documents.length === 0 || isLoading
							}
							isChatHistoryEmpty={messages.length <= 3}
						/>
					}
				/>
			)}
		</div>
	);
}
