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
			<head>
				<title>Context AI - Your AI-powered document assistant</title>
				<meta
					name="description"
					content="Context AI: An intelligent AI Chatbot for seamless document interaction. Upload PDFs, DOCX, and TXT files for insightful conversations."
				/>
				<meta
					name="keywords"
					content="Context AI, assistant, smart document analysis, chat, chatbot, document interaction, API key, model selection, PDF, DOCX, TXT, AI chat, intelligent assistant"
				/>
				<meta
					property="og:title"
					content="Context AI - Your AI-powered document assistant"
				/>
				<meta
					property="og:description"
					content="Context AI: An intelligent AI Chatbot for seamless document interaction. Upload PDFs, DOCX, and TXT files for insightful conversations."
				/>
				<meta property="og:type" content="website" />
				<link
					rel="icon"
					type="image/png"
					href="/favicon-96x96.png"
					sizes="96x96"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body
				suppressHydrationWarning
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<div className="flex justify-center h-screen">
					<main className="max-w-7xl w-full h-full">{children}</main>
				</div>
			</body>
		</html>
	);
}
