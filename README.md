# Context AI

**Context AI** is an intelligent document assistant built with [Next.js](https://nextjs.org) that leverages the power of the Google Gemini AI model. It enables users to effortlessly upload and interact with various document formats (PDF, TXT, Markdown, HTML), extracting key information and answering questions based _exclusively_ on the provided content.

## 🌟 Features

-   **Gemini API Key Integration**: Securely input and use your Google Gemini API key.
-   **AI Model Selection**: Choose from a list of available Google Gemini models for document analysis.
-   **Multi-format Document Upload**: Upload documents in PDF, TXT, Markdown, and HTML formats.
-   **Intelligent Document Querying**: Ask questions about your uploaded documents, and the AI will provide answers based _exclusively_ on their content.
-   **Chat History**: Maintain a clear history of your interactions and AI responses.
-   **Responsive User Interface**: Enjoy a seamless experience on both desktop and mobile devices, with a tabbed interface for mobile.

## 🛠️ Technology Stack

-   **Framework**: Next.js (React)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **AI Integration**: Google Gemini API (`@google/generative-ai`)
-   **Document Parsing**:
    -   `html-to-text`: For converting HTML documents to plain text.
    -   `pdfjs-dist`: For parsing PDF documents.
-   **UI Components**: Radix UI (via Shadcn UI)
-   **HTTP Client**: Axios
-   **Markdown Rendering**: `react-markdown`, `remark-gfm`
-   **Icons**: Lucide React

## ⚙️ Installation and Setup

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, pnpm, or bun

### Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nicholaslhq/context-ai.git
    cd context-ai
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Deploy (Optional)

To build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

To start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔍 Troubleshooting

### Common Issues

-   **API Key Not Accepted**: Ensure your Google Gemini API key is correct and has the necessary permissions.
-   **Document Parsing Errors**: Verify that your uploaded documents are in one of the supported formats (PDF, TXT, Markdown, HTML) and are not corrupted.
-   **No AI Response**: Check your internet connection and ensure the Gemini API is accessible. If the issue persists, try selecting a different model.

### For Additional Help

If you encounter further issues, please open an issue on the [GitHub repository](https://github.com/nicholaslhq/context-ai).

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 👤 Credits

This project was developed and is maintained solely by [Nicholas Lee](https://github.com/nicholaslhq). All aspects of the design, development, and implementation have been carried out independently.

Thank you for checking out the **Context AI**.
