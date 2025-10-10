"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Send, Trash2 } from "lucide-react"; // Import icons

interface QueryInputProps {
	onQuerySubmit: (query: string) => void;
	onClearChat: () => void;
	disabled: boolean;
}

export default function QueryInput({
	onQuerySubmit,
	onClearChat,
	disabled,
}: QueryInputProps) {
	const [query, setQuery] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + "px";
		}
	}, [query]);

	const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
		e.preventDefault();
		if (query.trim() && !disabled) {
			onQuerySubmit(query);
			setQuery("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			handleSubmit(e);
		}
	};

	return (
		<div className="flex w-full space-x-2">
			<Textarea
				id="query"
				ref={textareaRef}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Ask a question about your documents..."
				rows={1} // Start with 1 row and let it expand
				disabled={disabled}
				className="min-h-[106px] md:min-h-[48px] resize-none overflow-y-hidden bg-background text-sm md:text-base" // Adjusted padding-right and added overflow-y-auto
				style={{ maxHeight: "150px" }} // Set a max height for the textarea
			/>
			<div className="flex flex-col md:flex-row items-start gap-2">
				<Button
					type="submit"
					size="icon"
					disabled={disabled || !query.trim()}
					onClick={handleSubmit}
					className="p-6"
				>
					<Send className="h-8 w-8" />
					<span className="sr-only">Send message</span>
				</Button>
				<Button
					type="button"
					size="icon"
					variant="outline"
					disabled={disabled}
					onClick={onClearChat}
					className="p-6"
				>
					<Trash2 className="h-8 w-8" />
					<span className="sr-only">Clear chat</span>
				</Button>
			</div>
		</div>
	);
}
