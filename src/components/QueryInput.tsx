"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

interface QueryInputProps {
	onQuerySubmit: (query: string) => void;
	disabled: boolean;
}

export default function QueryInput({
	onQuerySubmit,
	disabled,
}: QueryInputProps) {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			onQuerySubmit(query);
			setQuery("");
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Query KnowledgeBase</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="query">Your Question</Label>
						<Textarea
							id="query"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Ask a question about your documents..."
							rows={4}
							disabled={disabled}
							required
						/>
					</div>
					<Button
						type="submit"
						disabled={disabled || !query.trim()}
						className="w-full"
					>
						Ask Question
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
