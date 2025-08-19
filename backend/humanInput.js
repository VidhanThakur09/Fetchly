import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import "dotenv/config";

//  * * @param {string} textInput The string of text to be converted and stored.
export default async function embedAndStoreString(textInput) {
  // 1. Create a LangChain Document from the string input.
  // The fromDocuments method of the vector store expects an array of Document objects.
  const docs = [new Document({ pageContent: textInput })];

  // 2. Initialize the Google Generative AI Embeddings model.
  // The API key is loaded from your .env file, just like in your example.
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004", // This is the recommended model for text embeddings
  });

  try {
    // 3. Store the documents in the Qdrant vector database.
    // The method takes the created documents and the embeddings model.
    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "chaiCode-Collection",
    });

    console.log(`Embedding for string "${textInput}" has been successfully stored.`);
    
  } catch (error) {
    console.error("Failed to store the vector embedding:", error);
  }
}

// Example usage of the function
// const myString = "LangChain is a framework for developing applications powered by language models.";
// embedAndStoreString(myString);
