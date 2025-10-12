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
import { useSettings } from "@/context/SettingsContext";

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
	const { setIsModelSelectedComplete } = useSettings();

	const handleValueChange = (value: string) => {
		onSelectModel(value);
		setIsModelSaved(false);
	};

	const defaultModelName = "models/gemini-flash-latest";

	const chatModels = models.filter(
		(model) =>
			model.supportedGenerationMethods?.includes("generateContent") &&
			model.name.includes("gemini") &&
			!model.name.includes("image") &&
			!model.name.includes("embedding")
	);

	const sortedModels = chatModels.sort((a, b) => {
		if (a.name.includes("latest") && !b.name.includes("latest")) return -1;
		if (!a.name.includes("latest") && b.name.includes("latest")) return 1;
		return b.name.localeCompare(a.name);
	});

	useEffect(() => {
		if (!selectedModel) {
			const storedModel = loadFromLocalStorage("geminiSelectedModel");
			if (
				storedModel &&
				models.some((model) => model.name === storedModel)
			) {
				onSelectModel(storedModel);
				setIsModelSaved(true);
				setIsModelSelectedComplete(true);
			} else if (sortedModels.length > 0) {
				const geminiFlashLatest = sortedModels.find(
					(model) => model.name === defaultModelName
				);
				if (geminiFlashLatest) {
					onSelectModel(geminiFlashLatest.name);
					setIsModelSelectedComplete(true);
				} else {
					onSelectModel(sortedModels[0].name);
					setIsModelSelectedComplete(true);
				}
			} else {
				setIsModelSelectedComplete(false);
			}
		} else {
			setIsModelSelectedComplete(true);
		}
	}, [
		models,
		onSelectModel,
		sortedModels,
		selectedModel,
		setIsModelSelectedComplete,
	]);

	useEffect(() => {
		if (!selectedModel && sortedModels.length === 0) {
			setNoModelsError(true);
			setIsModelSelectedComplete(false);
		} else {
			setNoModelsError(false);
			if (selectedModel) {
				setIsModelSelectedComplete(true);
			}
		}
		setIsModelSaved(
			loadFromLocalStorage("geminiSelectedModel") === selectedModel
		);
	}, [selectedModel, sortedModels, setIsModelSelectedComplete]);

	const handleSaveModel = () => {
		if (selectedModel) {
			saveToLocalStorage("geminiSelectedModel", selectedModel);
			setIsModelSaved(true);
			setIsModelSelectedComplete(true);
		}
	};

	const handleClearModel = () => {
		removeFromLocalStorage("geminiSelectedModel");
		setIsModelSaved(false);
		onSelectModel("");
		setIsModelSelectedComplete(false);
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
