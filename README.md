# Fetchly: A Retrieval-Augmented Generation (RAG) Web Application

Fetchly is a full-stack web application designed to demonstrate a Retrieval-Augmented Generation (RAG) system. It provides a user-friendly interface for ingesting various types of data—text, PDFs, and web content—and then allows users to ask questions about that data to an AI assistant. The application leverages a **Qdrant** vector database for efficient data retrieval and **LangChain** and **Google's Generative AI** models for the RAG pipeline.

## 🚀 Features

* **Diverse Data Ingestion:**
    * **Manual Text Input:** Submit raw text directly to the RAG store.
    * **PDF Upload:** Upload PDF documents for automatic processing and embedding.
    * **Web Scraping:** Provide URLs for videos or web pages to scrape their content.
* **Intelligent AI Chat:**
    * Interact with a smart AI assistant that uses your provided data as context to generate accurate and relevant responses.
* **Modern User Interface:**
    * A clean, responsive, and visually appealing interface built with **React** and **Tailwind CSS**.
    * Includes dynamic components for data submission, file handling, and a real-time chat.
* **Scalable Backend:**
    * A robust **Node.js** backend powered by **Express.js**.
    * Utilizes a **Qdrant** vector database running in a Docker container for high-performance vector similarity search.

## 🛠️ Tech Stack

### Frontend
* **React:** For building the user interface.
* **TypeScript:** For type-safe JavaScript development.
* **Tailwind CSS:** For rapid and responsive UI styling.
* **Axios:** For making API requests to the backend.
* **Lucide-React:** For a modern icon set.

### Backend
* **Node.js & Express.js:** The server runtime and web framework.
* **LangChain.js:** For building the RAG pipeline, including document loading, splitting, and retrieval.
* **Google Generative AI SDK:** For generating text embeddings (`text-embedding-004`) and AI chat responses (`gemini-2.0-flash`).
* **Qdrant:** An open-source vector search database for storing and retrieving vector embeddings.
* **Multer:** Middleware for handling file uploads.
* **Puppeteer & Cheerio:** Used for web scraping and cleaning HTML content.

## 📦 Project Structure

The project is divided into two main parts: `frontend` and `backend`.

```
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx    # Chat component for AI interaction
│   │   │   ├── DataSource.tsx       # Text input component
│   │   │   ├── FileUpload.tsx       # File upload component
│   │   │   ├── RagStore.tsx         # Visual representation of the RAG store
│   │   │   └── VideoUpload.tsx      # Video URL input and scraping
│   │   ├── pages/
│   │   │   ├── Index.tsx            # Main application layout
│   │   │   └── NotFound.tsx         # 404 page
│   │   └── App.tsx                  # Main app and routing setup
│   └── package.json                 # Frontend dependencies
├── backend/
│   ├── index.js                     # Main Express server file
│   ├── humanInput.js                # Logic for text input processing
│   ├── pdfuploader.js               # Logic for PDF file processing
│   ├── webScraping.js               # Logic for web content scraping
│   ├── retriver.js                  # Logic for fetching and generating AI responses
│   └── package.json                 # Backend dependencies
├── docker-compose.yml               # Docker configuration for Qdrant
└── README.md                        # This file
```

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* Docker & Docker Compose
* An API key for Google's Generative AI.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd fetchly
    ```

2.  **Set up the environment:**
    Create a `.env` file in the `backend/` directory with your Google API key.
    ```env
    # backend/.env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    QDRANT_URL="http://localhost:6333" # Default, change if your Qdrant instance is elsewhere
    ```

3.  **Start the Qdrant database with Docker:**
    Navigate to the project root and run Docker Compose.
    ```bash
    docker-compose up -d
    ```

4.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

5.  **Run the backend server:**
    ```bash
    npm start
    ```
    The server will run on the port specified in your `.env` file (or default to `3000`).

6.  **Install frontend dependencies:**
    Open a new terminal, navigate to the `frontend/` directory.
    ```bash
    cd ../frontend
    npm install
    ```

7.  **Run the frontend application:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173` (or a similar address).

## 📝 Usage

1.  **Ingest Data:** Use the "Data Source", "File Upload", or "Video Upload" panels to populate the RAG store with your information.
2.  **Wait for Processing:** The animated arrows and loading indicators will show you when data is being processed.
3.  **Chat with AI:** Once the data is in the RAG store, navigate to the "Chat Interface" and start asking questions related to the content you provided. The AI will use your data to answer your questions.
