import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as cheerio from "cheerio"; 
import "dotenv/config";

export default async function scrapeWebsite(url) {
  const loader = new PuppeteerWebBaseLoader(url);

  // 1. Load raw page content
  const result = await loader.load();
  const rawHtml = result[0].pageContent;

  // 2. Clean the HTML -> plain text
  const $ = cheerio.load(rawHtml);
  $("script, style, meta, noscript").remove(); // remove unnecessary tags
  const cleanText = $("body").text().replace(/\s+/g, " ").trim();

  // 3. Split into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const docs = await splitter.createDocuments([cleanText]);

  // 4. Convert to embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  try {
    // 5. Store in Qdrant
    const vectorStore = await QdrantVectorStore.fromDocuments(
      docs,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "chaiCode-Collection",
        apiKey: process.env.QDRANT_API_KEY,
      }
    );

    console.log(
      `✅ Successfully stored ${docs.length} text chunks from "${url}" into Qdrant.`
    );
  } catch (error) {
    console.error("❌ Failed to store the vector embedding:", error);
  }
}

// scrapeWebsite("https://en.wikipedia.org/wiki/Proceratosaurus");
