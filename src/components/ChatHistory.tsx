import React, { useState, useEffect } from "react";
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
		<div className="flex-1 space-y-2">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`flex ${message.sender === "user"
							? "justify-end"
							: "justify-start"
						}`}
				>
					<div
						className={`max-w-[90%] p-3 rounded-lg overflow-x-hidden ${message.sender === "user"
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
							<div
								className={`prose break-words text-sm md:text-base ${message.sender === "user"
										? "text-white"
										: ""
									}`}
							>
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										a: ({ node, ...props }) => (
											<a
												{...props}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 hover:underline"
											/>
										),
									}}
								>
									{message.text}
								</ReactMarkdown>
							</div>
						)}
						{message.timestamp && (
							<ClientSideTimestamp
								timestamp={message.timestamp}
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

const ClientSideTimestamp: React.FC<{ timestamp: string }> = ({
	timestamp,
}) => {
	const [clientTimestamp, setClientTimestamp] = useState<string | null>(null);

	useEffect(() => {
		setClientTimestamp(timestamp);
	}, [timestamp]);

	if (!clientTimestamp) {
		return (
			<div className="text-xs mt-1 opacity-0 select-none min-h-[1rem]">
				...
			</div>
		);
	}

	return (
		<div className="text-xs md:text-sm mt-1 opacity-75 select-none">
			{clientTimestamp}
		</div>
	);
};

export default ChatHistory;
