import { convert } from "html-to-text";

export async function parseHtml(file: File): Promise<string> {
	const text = await file.text();
	return convert(text, {
		wordwrap: 130,
	});
}

export async function parsePdf(file: File): Promise<string> {
	const pdfjsLib = await import("pdfjs-dist");
	interface TextItem {
		str: string;
		dir: string;
		width: number;
		height: number;
		transform: number[];
		fontName: string;
		hasEOL: boolean;
	}

	pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

	const arrayBuffer = await file.arrayBuffer();
	const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
	let fullText = "";
	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();
		fullText += textContent.items
			.filter(
				(item): item is TextItem =>
					typeof item === "object" && item !== null && "str" in item
			)
			.map((item) => item.str)
			.join(" ");
	}
	return fullText;
}

export async function parseTxt(file: File): Promise<string> {
	return file.text();
}

export async function parseMarkdown(file: File): Promise<string> {
	return file.text();
}

export async function parseDocument(file: File): Promise<string> {
	const fileType = file.type;

	if (fileType === "text/html") {
		return parseHtml(file);
	} else if (fileType === "application/pdf") {
		return parsePdf(file);
	} else if (fileType === "text/plain") {
		return parseTxt(file);
	} else if (
		fileType === "text/markdown" ||
		file.name.endsWith(".md") ||
		file.name.endsWith(".markdown")
	) {
		return parseMarkdown(file);
	} else {
		throw new Error(`Unsupported file type: ${fileType}`);
	}
}
