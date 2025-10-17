import React, { Dispatch, SetStateAction } from "react";
import ApiKeyInput from "./ApiKeyInput";
import DocumentUpload, { UploadedFile } from "./DocumentUpload";
import ModelSelector from "./ModelSelector";
import { GeminiModel } from "@/utils/geminiApi";

interface MobileSettingsContentProps {
	apiKey: string | null;
	setApiKey: (key: string | null) => void;
	availableModels: GeminiModel[];
	setAvailableModels: (models: GeminiModel[]) => void;
	selectedModel: string | null;
	setSelectedModel: (model: string | null) => void;
	handleDocumentsUpload: () => void;
	uploadedFiles: UploadedFile[];
	setUploadedFiles: Dispatch<SetStateAction<UploadedFile[]>>;
}

const MobileSettingsContent: React.FC<MobileSettingsContentProps> = ({
	apiKey,
	setApiKey,
	availableModels,
	setAvailableModels,
	selectedModel,
	setSelectedModel,
	handleDocumentsUpload,
	uploadedFiles,
	setUploadedFiles,
}) => {
	return (
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
	);
};

export default MobileSettingsContent;
