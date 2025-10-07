"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
	X,
	CheckCircle2,
	Loader2,
	AlertCircle,
	Save,
	Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { listModels, GeminiModel } from "@/utils/geminiApi";
import { Button } from "./ui/button";
import {
	saveToLocalStorage,
	loadFromLocalStorage,
	removeFromLocalStorage,
} from "@/utils/localStorage";

interface ApiKeyInputProps {
	onApiKeySubmit: (apiKey: string) => void;
	onModelsLoaded: (models: GeminiModel[]) => void;
}

type ApiKeyStatus = "idle" | "validating" | "valid" | "invalid";

export default function ApiKeyInput({
	onApiKeySubmit,
	onModelsLoaded,
}: ApiKeyInputProps) {
	const [apiKey, setApiKey] = useState("");
	const [status, setStatus] = useState<ApiKeyStatus>("idle");
	const [availableModels, setAvailableModels] = useState<GeminiModel[]>([]);
	const [isApiKeySaved, setIsApiKeySaved] = useState(false);

	useEffect(() => {
		const storedApiKey = loadFromLocalStorage("geminiApiKey");
		if (storedApiKey) {
			setApiKey(storedApiKey);
			// No immediate validation here, let the debounced effect handle it
			setIsApiKeySaved(true);
		}
	}, []); // Empty dependency array means this effect runs once on mount

	useEffect(() => {
		const handler = setTimeout(() => {
			if (apiKey) {
				validateApiKey(apiKey);
			} else {
				setStatus("idle");
				setIsApiKeySaved(false);
			}
		}, 500); // Debounce for 500ms

		return () => {
			clearTimeout(handler);
		};
	}, [apiKey]); // This effect runs when apiKey changes, for validation

	const validateApiKey = async (key: string) => {
		setStatus("validating");
		try {
			// Attempt to list models to validate the API key
			const models = await listModels(key);
			setStatus("valid");
			onApiKeySubmit(key);
			setAvailableModels(models);
			onModelsLoaded(models);
			setIsApiKeySaved(loadFromLocalStorage("geminiApiKey") === key);
		} catch (error) {
			console.error("API Key validation or model listing failed:", error);
			setStatus("invalid");
			setIsApiKeySaved(false);
		}
	};

	const handleSaveApiKey = () => {
		saveToLocalStorage("geminiApiKey", apiKey);
		setIsApiKeySaved(true);
	};

	const handleClearApiKey = () => {
		removeFromLocalStorage("geminiApiKey");
		setApiKey("");
		setStatus("idle");
		setIsApiKeySaved(false);
		onApiKeySubmit(""); // Clear the API key in the parent component as well
		onModelsLoaded([]); // Clear models in the parent component
	};

	const getStatusIcon = (currentStatus: ApiKeyStatus) => {
		switch (currentStatus) {
			case "validating":
				return (
					<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
				);
			case "valid":
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case "invalid":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			default:
				return null;
		}
	};

	return (
		<Card className="w-full w-md max-w-md">
			<CardHeader>
				<CardTitle>Gemini API Key</CardTitle>
				<CardDescription>
					Please enter your Gemini API key.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="apiKey">API Key</Label>
						<div className="relative">
							<Input
								id="apiKey"
								type="password"
								value={apiKey}
								onChange={(e) => {
									setApiKey(e.target.value);
									setIsApiKeySaved(false); // Indicate unsaved changes
								}}
								placeholder="Enter your Gemini API key"
								required
								className={cn(
									status === "invalid" &&
										"border-red-500 focus-visible:ring-red-500 pr-8",
									status === "valid" &&
										"border-green-500 focus-visible:ring-green-500 pr-8"
								)}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								{getStatusIcon(status)}
							</div>
						</div>
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							{isApiKeySaved ? (
								<span className="flex items-center text-green-600">
									<CheckCircle2 className="h-4 w-4 mr-1" />{" "}
									Saved
								</span>
							) : status == "valid" ? (
								<span className="flex items-center text-yellow-600">
									<AlertCircle className="h-4 w-4 mr-1" /> API
									Not Saved
								</span>
							) : (
								<span className="flex items-center text-yellow-600">
									<AlertCircle className="h-4 w-4 mr-1" />
									Missing API Key
								</span>
							)}
							<div className="flex gap-2">
								{!isApiKeySaved && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleSaveApiKey}
										disabled={
											!apiKey ||
											status !== "valid" ||
											isApiKeySaved
										}
									>
										<Save className="h-4 w-4" />
									</Button>
								)}
								{isApiKeySaved && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleClearApiKey}
										disabled={!apiKey && !isApiKeySaved}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
