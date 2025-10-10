"use client";

import { useState, useEffect } from "react";
import ApiKeyInput from "../components/ApiKeyInput";
import DocumentUpload, { UploadedFile } from "../components/DocumentUpload";
import QueryInput from "../components/QueryInput";
import ChatHistory from "../components/ChatHistory"; // Import ChatHistory
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseDocument } from "../utils/documentParser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ModelSelector from "@/components/ModelSelector";
import { GeminiModel } from "@/utils/geminiApi";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadFromLocalStorage } from "@/utils/localStorage";
import MobileTabs from "@/components/MobileTabs";
import { useMediaQuery } from "@/lib/utils"; // Import useMediaQuery

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
			text: "Welcome to **Context AI**! 👋 I'm here to help you extract knowledge from your documents and answer any questions based on them. Let’s get started!",
			sender: "ai",
			timestamp: new Date().toLocaleTimeString(),
		},
		{
			id: "2",
			text: "1.Enter your Gemini API key. \n\n 2.Select a Gemini model. \n\n 3.Upload your document in HTML, PDF, or TXT format.",
			sender: "ai",
			timestamp: new Date().toLocaleTimeString(),
		},
		{
			id: "3",
			text: "Once done, feel free to ask me anything about the document!",
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

	const handleDocumentsUpload = (files: File[]) => {
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

			const prompt = `Given the following documents:\n\n${documentTexts.join(
				"\n\n"
			)}\n\nAnswer the following question based only on the provided documents: ${query}`;

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
					<div className="flex flex-col md:gap-2 md:w-80 min-w-80 h-full">
						<ApiKeyInput
							onApiKeySubmit={setApiKey}
							onModelsLoaded={setAvailableModels}
						/>
						{apiKey && availableModels.length > 0 && (
							<ModelSelector
								models={availableModels}
								onSelectModel={setSelectedModel}
								selectedModel={selectedModel}
							/>
						)}
						<div className="md:flex-1 flex flex-col flex-1">
							<DocumentUpload
								onDocumentsUpload={handleDocumentsUpload}
								uploadedFiles={uploadedFiles}
								setUploadedFiles={setUploadedFiles}
							/>
						</div>
					</div>
					<div className="flex flex-col flex-1 h-full">
						<Card className="flex flex-col flex-1 h-full">
							<CardHeader>
								<CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-indigo-300 inline-block text-transparent bg-clip-text">
									Context AI
								</CardTitle>
								<CardDescription>
									Your AI-powered document assistant
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col flex-1 overflow-y-auto">
								<ChatHistory messages={messages} />
								{isLoading && (
									<div className="flex justify-start mt-4">
										<div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%]">
											<div className="flex space-x-1">
												<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
												<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
												<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
											</div>
										</div>
									</div>
								)}
							</CardContent>
							<div className="sticky bottom-0 z-10 m-4">
								<QueryInput
									onQuerySubmit={handleQuerySubmit}
									onClearChat={handleClearChat}
									disabled={
										!apiKey ||
										documents.length === 0 ||
										isLoading
									}
								/>
							</div>
						</Card>
					</div>
				</>
			) : (
				/* Mobile-only tabs */
				<MobileTabs
					settingsContent={
						<div className="flex flex-col p-2 gap-2 mt-2">
							<ApiKeyInput
								onApiKeySubmit={setApiKey}
								onModelsLoaded={setAvailableModels}
							/>
							{apiKey && availableModels.length > 0 && (
								<ModelSelector
									models={availableModels}
									onSelectModel={setSelectedModel}
									selectedModel={selectedModel}
								/>
							)}
							<DocumentUpload
								onDocumentsUpload={handleDocumentsUpload}
								uploadedFiles={uploadedFiles}
								setUploadedFiles={setUploadedFiles}
							/>
						</div>
					}
					chatContent={
						<div className="flex flex-col flex-1 h-full">
							<div className="flex flex-col flex-1 h-full bg-background">
								<div className="flex flex-col flex-1 overflow-y-auto px-4 py-10">
									<ChatHistory messages={messages} />
									{isLoading && (
										<div className="flex justify-start mt-4">
											<div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%]">
												<div className="flex space-x-1">
													<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
													<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
													<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					}
					queryInput={
						<QueryInput
							onQuerySubmit={handleQuerySubmit}
							onClearChat={handleClearChat}
							disabled={
								!apiKey || documents.length === 0 || isLoading
							}
						/>
					}
				/>
			)}
		</div>
	);
}
