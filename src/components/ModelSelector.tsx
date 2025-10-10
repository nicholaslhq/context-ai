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
import { Button } from "./ui/button";
import { CheckCircle2, AlertCircle, Save, Trash2 } from "lucide-react";
import {
	saveToLocalStorage,
	loadFromLocalStorage,
	removeFromLocalStorage,
} from "@/utils/localStorage";

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
	const [isModelSaved, setIsModelSaved] = useState(false);

	const handleValueChange = (value: string) => {
		onSelectModel(value);
		setIsModelSaved(false); // Indicate unsaved changes
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

	useEffect(() => {
		// Only attempt to set an initial model if no model is currently selected
		if (!selectedModel) {
			const storedModel = loadFromLocalStorage("geminiSelectedModel");
			if (
				storedModel &&
				models.some((model) => model.name === storedModel)
			) {
				onSelectModel(storedModel);
				setIsModelSaved(true);
			} else if (sortedModels.length > 0) {
				// If no stored model or stored model is invalid, set a default
				const geminiFlashLatest = sortedModels.find(
					(model) => model.name === defaultModelName
				);
				if (geminiFlashLatest) {
					onSelectModel(geminiFlashLatest.name);
				} else {
					// Ensure sortedModels is not empty before accessing
					onSelectModel(sortedModels[0].name); // Access first element of array
				}
			}
		}
	}, [models, onSelectModel, sortedModels, selectedModel]);

	useEffect(() => {
		if (!selectedModel && sortedModels.length === 0) {
			setNoModelsError(true);
		} else {
			setNoModelsError(false);
		}
		setIsModelSaved(
			loadFromLocalStorage("geminiSelectedModel") === selectedModel
		);
	}, [selectedModel, sortedModels]); // Re-evaluate when selectedModel or sortedModels changes

	const handleSaveModel = () => {
		if (selectedModel) {
			saveToLocalStorage("geminiSelectedModel", selectedModel);
			setIsModelSaved(true);
		}
	};

	const handleClearModel = () => {
		removeFromLocalStorage("geminiSelectedModel");
		setIsModelSaved(false);
		onSelectModel(""); // Clear the selected model in the parent component
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Select Gemini Model</CardTitle>
				<CardDescription>Choose a Gemini model</CardDescription>
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
						<>
							<Select
								onValueChange={handleValueChange}
								value={selectedModel || ""}
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
							<div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
								{isModelSaved ? (
									<span className="flex items-center text-green-600">
										<CheckCircle2 className="h-4 w-4 mr-1" />{" "}
										Saved
									</span>
								) : (
									<span className="flex items-center text-yellow-600">
										<AlertCircle className="h-4 w-4 mr-1" />{" "}
										Not Saved
									</span>
								)}
								<div className="flex gap-2">
									{!isModelSaved && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleSaveModel}
											disabled={
												!selectedModel || isModelSaved
											}
										>
											<Save className="h-4 w-4" />
										</Button>
									)}
									{isModelSaved && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleClearModel}
											disabled={
												!selectedModel && !isModelSaved
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
