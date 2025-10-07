import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
	id: string;
	text: string;
	sender: "user" | "ai";
	timestamp?: string;
	loading?: boolean;
}

interface ChatHistoryProps {
	messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
	return (
		<div className="flex-1 p-4 space-y-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`flex ${
						message.sender === "user"
							? "justify-end"
							: "justify-start"
					}`}
				>
					<div
						className={`max-w-[90%] p-3 rounded-lg overflow-x-hidden ${
							message.sender === "user"
								? "bg-gray-800 text-white"
								: "bg-gray-100 text-gray-800"
						}`}
					>
						{message.loading ? (
							<div className="flex space-x-1">
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
								<div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
							</div>
						) : (
							<div className="break-words">
								<ReactMarkdown remarkPlugins={[remarkGfm]}>
									{message.text}
								</ReactMarkdown>
							</div>
						)}
						{message.timestamp && (
							<div className="text-xs mt-1 opacity-75 select-none">
								{message.timestamp}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatHistory;
