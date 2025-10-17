import React from "react";
import ChatHistory from "./ChatHistory";

interface MobileChatContentProps {
	messages: {
		id: string;
		text: string;
		sender: "user" | "ai";
		timestamp: string;
		loading?: boolean;
	}[];
	isLoading: boolean;
}

const MobileChatContent: React.FC<MobileChatContentProps> = ({
	messages,
	isLoading,
}) => {
	return (
		<div className="flex flex-col flex-1 h-full">
			<div className="flex flex-col flex-1 h-full bg-background">
				<div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
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
				</div>
			</div>
		</div>
	);
};

export default MobileChatContent;
