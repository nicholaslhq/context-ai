"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Settings } from "lucide-react"; // Import the Settings icon
import { useSettings } from "@/context/SettingsContext"; // Import the useSettings hook

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
	const { areAllSettingsComplete } = useSettings(); // Use the settings context

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
				className={`fixed top-0 left-0 right-0 z-10 flex justify-around transition-transform duration-300 ${
					isHidden ? "-translate-y-full" : "translate-y-0"
				}`}
			>
				<div
					onClick={() => setActiveTab("chat")}
					className={`flex-1 h-16 flex flex-col justify-center items-center gap-0 cursor-pointer transition-all duration-300 ease-in-out ${
						activeTab === "chat"
							? "border-b-2 border-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
							: "border-b-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
					}`}
				>
					<span
						className={`text-2xl font-bold ${
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
						Your AI-powered document assistant
					</span>
				</div>
				<div
					onClick={() => setActiveTab("settings")}
					className={`relative w-16 h-16 flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out ${
						activeTab === "settings"
							? "border-b-2 border-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
							: "border-b-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-black dark:text-white"
					}`}
				>
					<Settings className="h-5 w-5" />
					{!areAllSettingsComplete && (
						<span className="absolute top-1 right-1 flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
						</span>
					)}
				</div>
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
