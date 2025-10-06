import axios from "axios";

export interface GeminiModel {
	name: string;
	displayName: string;
	description: string;
	inputTokenLimit: number;
	outputTokenLimit: number;
	supportedGenerationMethods: string[];
	temperature: number;
	topP: number;
	topK: number;
}

export async function listModels(apiKey: string): Promise<GeminiModel[]> {
	const response = await axios.get(
		`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
	);
	return response.data.models as GeminiModel[];
}
