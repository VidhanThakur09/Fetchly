import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import "dotenv/config";
import { QdrantVectorStore } from "@langchain/qdrant";

export default async function loadPDF(filePath='') {
  const pdfPath = filePath;
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004", // 768 dimensions
    // taskType: TaskType.RETRIEVAL_DOCUMENT,
    // title: "Document title",
  });

  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "chaiCode-Collection",
  });
  console.log("indexing of data Done ......");
}

// loadPDF('./node.pdf');
