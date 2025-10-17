import React from "react";
import ChatHistory from "./ChatHistory";
import QueryInput from "./QueryInput";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ChatWindowProps {
	messages: {
		id: string;
		text: string;
		sender: "user" | "ai";
		timestamp: string;
		loading?: boolean;
	}[];
	isLoading: boolean;
	handleQuerySubmit: (query: string) => void;
	handleClearChat: () => void;
	apiKey: string | null;
	documents: File[];
	isChatHistoryEmpty: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
	messages,
	isLoading,
	handleQuerySubmit,
	handleClearChat,
	apiKey,
	documents,
	isChatHistoryEmpty,
}) => {
	return (
		<Card className="flex flex-col flex-1 h-full">
			<CardHeader>
				<CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-indigo-300 inline-block text-transparent bg-clip-text">
					Context AI
				</CardTitle>
				<CardDescription>
					Your AI-powered document assistant
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col flex-1 overflow-y-auto">
				<ChatHistory messages={messages} />
				{isLoading && (
					<div className="flex justify-start mt-4">
						<div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[70%]">
							<div className="flex space-x-1">
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
			<div className="sticky bottom-0 z-10 m-4">
				<QueryInput
					onQuerySubmit={handleQuerySubmit}
					onClearChat={handleClearChat}
					disabled={!apiKey || documents.length === 0 || isLoading}
					isChatHistoryEmpty={isChatHistoryEmpty}
				/>
			</div>
		</Card>
	);
};

export default ChatWindow;
