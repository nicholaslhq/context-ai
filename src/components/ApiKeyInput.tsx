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
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { listModels, GeminiModel } from "@/utils/geminiApi";

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

	useEffect(() => {
		const handler = setTimeout(() => {
			if (apiKey) {
				validateApiKey(apiKey);
			} else {
				setStatus("idle");
			}
		}, 500); // Debounce for 500ms

		return () => {
			clearTimeout(handler);
		};
	}, [apiKey]);

	const validateApiKey = async (key: string) => {
		setStatus("validating");
		try {
			// Attempt to list models to validate the API key
			const models = await listModels(key);
			setStatus("valid");
			onApiKeySubmit(key);
			setAvailableModels(models);
			onModelsLoaded(models);
		} catch (error) {
			console.error("API Key validation or model listing failed:", error);
			setStatus("invalid");
		}
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
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Gemini API Key</CardTitle>
				<CardDescription>
					Please enter your Gemini API key. It will not be stored
					beyond this session.
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
								onChange={(e) => setApiKey(e.target.value)}
								placeholder="Enter your Gemini API key"
								required
								className={cn(
									status === "invalid" &&
										"border-red-500 focus-visible:ring-red-500",
									status === "valid" &&
										"border-green-500 focus-visible:ring-green-500"
								)}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								{getStatusIcon(status)}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
