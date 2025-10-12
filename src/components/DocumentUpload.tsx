"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { CheckCircle2, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

const MAX_FILE_SIZE_MB = 20; // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes

export interface UploadedFile {
	id: string;
	file: File;
	status: "pending" | "uploading" | "uploaded" | "failed";
}

interface DocumentUploadProps {
	onDocumentsUpload: (files: File[]) => void;
	uploadedFiles: UploadedFile[];
	setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export default function DocumentUpload({
	onDocumentsUpload,
	uploadedFiles,
	setUploadedFiles,
}: DocumentUploadProps) {
	const { setIsDocumentUploadedComplete } = useSettings();

	useEffect(() => {
		setIsDocumentUploadedComplete(uploadedFiles.length > 0);
	}, [uploadedFiles, setIsDocumentUploadedComplete]);

	const processAndUploadFiles = async (filesToProcess: File[]) => {
		if (filesToProcess.length === 0) return;

		const newUploadedFiles: UploadedFile[] = filesToProcess.map((file) => ({
			id: Math.random().toString(36).substring(2, 9),
			file,
			status: "uploading",
		}));

		setUploadedFiles((prevFiles) => {
			const filteredPrevFiles = prevFiles.filter(
				(existingFile) =>
					!filesToProcess.some(
						(newFile) => newFile.name === existingFile.file.name
					)
			);
			return [...filteredPrevFiles, ...newUploadedFiles];
		});

		try {
			onDocumentsUpload(filesToProcess);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setUploadedFiles((prevFiles) =>
				prevFiles.map((f) =>
					newUploadedFiles.some((nf) => nf.id === f.id)
						? { ...f, status: "uploaded" }
						: f
				)
			);
		} catch (error) {
			console.error("Upload failed:", error);
			setUploadedFiles((prevFiles) =>
				prevFiles.map((f) =>
					newUploadedFiles.some((nf) => nf.id === f.id)
						? { ...f, status: "failed" }
						: f
				)
			);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			const validFiles = filesArray.filter((file) => {
				if (file.size > MAX_FILE_SIZE_BYTES) {
					alert(
						`File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
					);
					return false;
				}
				return true;
			});
			processAndUploadFiles(validFiles);
			e.target.value = "";
		}
	};

	const handleRemoveFile = (id: string) => {
		setUploadedFiles((prevFiles) =>
			prevFiles.filter((file) => file.id !== id)
		);
	};

	const getStatusIcon = (status: UploadedFile["status"]) => {
		switch (status) {
			case "pending":
				return (
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				);
			case "uploading":
				return (
					<Loader2 className="h-6 w-6 animate-spin text-gray-800" />
				);
			case "uploaded":
				return <CheckCircle2 className="h-6 w-6 text-green-500" />;
			case "failed":
				return <AlertCircle className="h-6 w-6 text-red-500" />;
			default:
				return null;
		}
	};

	return (
		<Card className="w-full flex flex-col flex-1 grow h-full">
			<CardHeader>
				<CardTitle>Upload Documents</CardTitle>
				<CardDescription>
					Supported formats: PDF, TXT, Markdown, HTML
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Input
							id="documents"
							type="file"
							accept=".html,.pdf,.txt,.md"
							multiple
							onChange={handleFileChange}
						/>
					</div>
					{uploadedFiles.length > 0 && (
						<div className="grid gap-2">
							<ul className="mt-2 grid gap-2 max-h-[250px] overflow-y-auto">
								{uploadedFiles.map((uploadedFile) => (
									<li
										key={uploadedFile.id}
										className="flex items-center justify-between rounded-md bg-muted p-2 text-sm"
									>
										<div className="flex items-center gap-2 break-all">
											{getStatusIcon(uploadedFile.status)}
											<span
												className={cn(
													uploadedFile.status ===
														"failed" &&
														"text-red-500"
												)}
											>
												{uploadedFile.file.name}
											</span>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												handleRemoveFile(
													uploadedFile.id
												)
											}
											className="h-auto p-2 opacity-50 hover:opacity-100 transition-all"
											disabled={
												uploadedFile.status ===
												"uploading"
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</li>
								))}
							</ul>
						</div>
					)}
					{uploadedFiles.length == 0 && (
						<div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
							<span className="flex items-center text-yellow-600">
								<AlertCircle className="h-4 w-4 mr-1" />
								No Document Uploaded
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
