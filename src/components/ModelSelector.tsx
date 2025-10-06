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
	const handleValueChange = (value: string) => {
		onSelectModel(value);
	};

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

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Select Gemini Model</CardTitle>
				<CardDescription>
					Choose the Gemini model you'd like to use for querying.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2">
					<Label htmlFor="model-selector">Model</Label>
					<Select
						onValueChange={handleValueChange}
						value={selectedModel || ""}
					>
						<SelectTrigger id="model-selector" className="w-full">
							<SelectValue placeholder="Select a model" />
						</SelectTrigger>
						<SelectContent>
							{sortedModels.map((model) => (
								<SelectItem key={model.name} value={model.name}>
									{model.displayName || model.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}
