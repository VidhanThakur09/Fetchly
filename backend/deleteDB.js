
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";
import { QdrantVectorStore } from "@langchain/qdrant";


export default async function deleteDB(){
     const qdrantConfig = {
       url: process.env.QDRANT_URL,
       collectionName: "chaiCode-Collection",
       apiKey: process.env.QDRANT_API_KEY,
     };

     const Deleteembeddings = new GoogleGenerativeAIEmbeddings({
       apiKey: process.env.GEMINI_API_KEY,
       model: "text-embedding-004", // 768 dimensions
       // taskType: TaskType.RETRIEVAL_DOCUMENT,
       // title: "Document title",
     });

     const delVectorStore = new QdrantVectorStore(
       Deleteembeddings,
       qdrantConfig
     );
     const qdrantClient = delVectorStore.client;


     try {
        await qdrantClient.deleteCollection(qdrantConfig.collectionName);
        console.log(
        `Collection '${qdrantConfig.collectionName}' deleted successfully.`
        );
    } catch (error) {
        console.error("Error deleting collection:", error);
    }
    }