"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
	const [activeTab, setActiveTab] = useState<"settings" | "chat">("settings");
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
				className={`fixed top-0 left-0 right-0 z-10 flex justify-around p-2 border-b bg-background transition-transform duration-300 ${
					isHidden ? "-translate-y-full" : "translate-y-0"
				}`}
			>
				<Button
					variant={activeTab === "settings" ? "default" : "outline"}
					onClick={() => setActiveTab("settings")}
					className="w-1/2 mx-1"
				>
					Settings
				</Button>
				<Button
					variant={activeTab === "chat" ? "default" : "outline"}
					onClick={() => setActiveTab("chat")}
					className="w-1/2 mx-1"
				>
					Context AI
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto pt-[56px] pb-[100px]">
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
