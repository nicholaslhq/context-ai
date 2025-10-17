import React, { Dispatch, SetStateAction } from "react";
import ApiKeyInput from "./ApiKeyInput";
import DocumentUpload, { UploadedFile } from "./DocumentUpload";
import ModelSelector from "./ModelSelector";
import { GeminiModel } from "@/utils/geminiApi";

interface DesktopSidebarProps {
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

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
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
	);
};

export default DesktopSidebar;
