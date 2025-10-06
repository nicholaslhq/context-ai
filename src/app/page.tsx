"use client";

import { useState } from "react";
import ApiKeyInput from "../components/ApiKeyInput";
import DocumentUpload from "../components/DocumentUpload";
import QueryInput from "../components/QueryInput";
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
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [documents, setDocuments] = useState<File[]>([]);
	const [queryResults, setQueryResults] = useState<string | null>(null);
	const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
	const [selectedModel, setSelectedModel] = useState<string | null>(null);

	const handleDocumentsUpload = (files: File[]) => {
		setDocuments(files);
		console.log("Uploaded documents:", files);
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

		setQueryResults("Processing your query...");

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
			setQueryResults(text);
		} catch (error) {
			console.error("Error querying Gemini API:", error);
			setQueryResults(
				"Error: Unable to get a response from Gemini API. Please check your API key and try again."
			);
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-4xl mb-8">
				<CardHeader className="text-center">
					<CardTitle className="text-4xl font-bold">
						Welcome to Gemini KnowledgeBase
					</CardTitle>
					<CardDescription className="text-lg text-muted-foreground mt-2">
						Upload your documents (HTML, PDF, TXT), input your
						Gemini API key, and start querying!
					</CardDescription>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
				<ApiKeyInput
					onApiKeySubmit={setApiKey}
					onModelsLoaded={setAvailableModels}
				/>
				<DocumentUpload onDocumentsUpload={handleDocumentsUpload} />
			</div>

			{apiKey && availableModels.length > 0 && (
				<div className="w-full max-w-4xl mb-8">
					<ModelSelector
						models={availableModels}
						onSelectModel={setSelectedModel}
						selectedModel={selectedModel}
					/>
				</div>
			)}

			{apiKey && documents.length > 0 && (
				<Card className="w-full max-w-4xl mb-8">
					<CardHeader>
						<CardTitle>Query KnowledgeBase</CardTitle>
					</CardHeader>
					<CardContent>
						<QueryInput
							onQuerySubmit={handleQuerySubmit}
							disabled={!apiKey || documents.length === 0}
						/>
						<Separator className="my-6" />
						<h3 className="text-xl font-semibold mb-4">Results</h3>
						{queryResults ? (
							<div className="bg-muted p-4 rounded-md text-foreground">
								<ReactMarkdown remarkPlugins={[remarkGfm]}>
									{queryResults}
								</ReactMarkdown>
							</div>
						) : (
							<div className="border border-dashed border-border p-4 text-center text-muted-foreground rounded-md">
								Query Results will be displayed here.
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
