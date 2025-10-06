"use client";

import { useState } from "react";
import { Button } from "./ui/button";
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

interface UploadedFile {
	id: string;
	file: File;
	status: "pending" | "uploading" | "uploaded" | "failed";
}

interface DocumentUploadProps {
	onDocumentsUpload: (files: File[]) => void;
}

export default function DocumentUpload({
	onDocumentsUpload,
}: DocumentUploadProps) {
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

	const processAndUploadFiles = async (filesToProcess: File[]) => {
		if (filesToProcess.length === 0) return;

		const newUploadedFiles: UploadedFile[] = filesToProcess.map((file) => ({
			id: Math.random().toString(36).substring(2, 9),
			file,
			status: "uploading",
		}));

		setUploadedFiles((prevFiles) => [...prevFiles, ...newUploadedFiles]);

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
			processAndUploadFiles(filesArray);
			e.target.value = ""; // Clear the input so the same file can be selected again
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
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
				);
			case "uploading":
				return (
					<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
				);
			case "uploaded":
				return <CheckCircle2 className="h-4 w-4 text-green-500" />;
			case "failed":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			default:
				return null;
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Upload Documents</CardTitle>
				<CardDescription>
					Supported formats: HTML, PDF, TXT, Markdown.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="documents">Documents</Label>
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
							<h4 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Selected Files:
							</h4>
							<ul className="mt-2 grid gap-2">
								{uploadedFiles.map((uploadedFile) => (
									<li
										key={uploadedFile.id}
										className="flex items-center justify-between rounded-md bg-muted p-2 text-sm"
									>
										<div className="flex items-center gap-2">
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
											className="h-auto p-1"
											disabled={
												uploadedFile.status ===
												"uploading"
											}
										>
											<X className="h-4 w-4" />
										</Button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
