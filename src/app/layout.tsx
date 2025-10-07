"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				suppressHydrationWarning
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="min-h-screen flex flex-col">
					<header className="bg-gray-800 text-white p-4 shadow-md">
						<h1 className="text-2xl font-bold">Context AI</h1>
					</header>
					<main className="flex-grow container mx-auto p-4">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
