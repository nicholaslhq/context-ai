import { useEffect, useState } from "react";
import { GeminiModel } from "@/utils/geminiApi";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
	models: GeminiModel[];
	onSelectModel: (modelName: string) => void;
	selectedModel: string | null;
}

export default function ModelSelector({
	models,
	onSelectModel,
	selectedModel,
}: ModelSelectorProps) {
	const [noModelsError, setNoModelsError] = useState(false);

	const handleValueChange = (value: string) => {
		onSelectModel(value);
	};

	const defaultModelName = "models/gemini-flash-latest";

	// Filter models to only show those that support `generateContent`
	const chatModels = models.filter((model) =>
		model.supportedGenerationMethods?.includes("generateContent")
	);

	// Sort models to show the latest versions first
	const sortedModels = chatModels.sort((a, b) => {
		// Assuming model names like "gemini-pro-1.5-latest" or "gemini-2.5-flash-preview-05-20"
		// This sorting might need refinement based on actual model naming conventions
		if (a.name.includes("latest") && !b.name.includes("latest")) return -1;
		if (!a.name.includes("latest") && b.name.includes("latest")) return 1;
		return b.name.localeCompare(a.name); // Fallback to alphabetical for consistent order
	});

	// Determine the effective selected model
	let effectiveSelectedModel = selectedModel;

	// If no model is selected, try to set a default
	if (!effectiveSelectedModel && sortedModels.length > 0) {
		const geminiFlashLatest = sortedModels.find(
			(model) => model.name === defaultModelName
		);

		if (geminiFlashLatest) {
			effectiveSelectedModel = geminiFlashLatest.name;
		} else {
			// If 'gemini-flash-latest' is not available, select the first model
			effectiveSelectedModel = sortedModels[0].name;
		}
	} else if (
		effectiveSelectedModel &&
		!sortedModels.some((model) => model.name === effectiveSelectedModel)
	) {
		// If the currently selected model is no longer available, default to gemini-flash-latest or the first available
		const geminiFlashLatest = sortedModels.find(
			(model) => model.name === defaultModelName
		);
		if (geminiFlashLatest) {
			effectiveSelectedModel = geminiFlashLatest.name;
		} else if (sortedModels.length > 0) {
			effectiveSelectedModel = sortedModels[0].name;
		} else {
			effectiveSelectedModel = null; // No models available
		}
		if (effectiveSelectedModel) {
			onSelectModel(effectiveSelectedModel);
		}
	}
	useEffect(() => {
		if (
			effectiveSelectedModel &&
			!sortedModels.some((model) => model.name === effectiveSelectedModel)
		) {
			// If the currently selected model is no longer available, default to gemini-flash-latest or the first available
			const geminiFlashLatest = sortedModels.find(
				(model) => model.name === defaultModelName
			);
			if (geminiFlashLatest) {
				onSelectModel(geminiFlashLatest.name);
			} else if (sortedModels.length > 0) {
				onSelectModel(sortedModels[0].name);
			} else {
				// No models available, or no suitable default
				setNoModelsError(true);
			}
		} else {
			setNoModelsError(false);
			if (effectiveSelectedModel && selectedModel === null) {
				// Only call onSelectModel if a default was programmatically chosen and no model was previously selected
				onSelectModel(effectiveSelectedModel);
			}
		}
	}, [effectiveSelectedModel, onSelectModel, sortedModels, selectedModel]);

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Select Gemini Model</CardTitle>
				<CardDescription>
					Choose the Gemini model you&apos;d like to use for querying.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2">
					<Label htmlFor="model-selector">Model</Label>
					{noModelsError ? (
						<CardDescription className="text-red-500">
							No models available. Please check your API key and
							network connection.
						</CardDescription>
					) : (
						<Select
							onValueChange={handleValueChange}
							value={effectiveSelectedModel || ""}
						>
							<SelectTrigger
								id="model-selector"
								className="w-full"
							>
								<SelectValue placeholder="Select a model" />
							</SelectTrigger>
							<SelectContent>
								{sortedModels.map((model) => (
									<SelectItem
										key={model.name}
										value={model.name}
									>
										{model.displayName || model.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
