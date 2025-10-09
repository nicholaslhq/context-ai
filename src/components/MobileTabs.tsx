"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react"; // Import the Settings icon

interface MobileTabsProps {
	settingsContent: ReactNode;
	chatContent: ReactNode;
	queryInput: ReactNode; // New prop for the query input
}

export default function MobileTabs({
	settingsContent,
	chatContent,
	queryInput,
}: MobileTabsProps) {
	const [activeTab, setActiveTab] = useState<"settings" | "chat">("chat");
	const [isHidden, setIsHidden] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY && currentScrollY > 50) {
				// Scrolling down
				setIsHidden(true);
			} else {
				// Scrolling up
				setIsHidden(false);
			}
			setLastScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	return (
		<div className="flex flex-col w-full h-full md:hidden">
			<div
				className={`fixed top-0 left-0 right-0 z-10 flex justify-around p-2 transition-transform duration-300 gap-2 ${
					isHidden ? "-translate-y-full" : "translate-y-0"
				}`}
			>
				<Button
					variant={activeTab === "chat" ? "default" : "outline"}
					onClick={() => setActiveTab("chat")}
					className="flex-1 h-16 flex flex-col justify-center items-center gap-0"
				>
					<span
						className={`text-xl font-bold ${
							activeTab === "chat"
								? "bg-gradient-to-r from-blue-500 via-green-400 to-indigo-300 inline-block text-transparent bg-clip-text"
								: "text-black dark:text-white"
						}`}
					>
						Context AI
					</span>
					<span
						className={`text-xs ${
							activeTab === "chat"
								? "text-gray-400 dark:text-gray-400"
								: "text-gray-500 dark:text-gray-400"
						}`}
					>
						Your AI-powered document assistant.
					</span>
				</Button>
				<Button
					variant={activeTab === "settings" ? "default" : "outline"}
					onClick={() => setActiveTab("settings")}
					className="w-16 h-16"
				>
					<Settings className="h-5 w-5" />
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto pt-[64px] pb-[100px]">
				{" "}
				{/* Add padding to prevent content from being obscured by fixed header and fixed query input */}
				{activeTab === "settings" ? settingsContent : chatContent}
			</div>
			{activeTab === "chat" && (
				<div className="fixed bottom-0 left-0 right-0 z-10 m-4">
					{queryInput}
				</div>
			)}
		</div>
	);
}
