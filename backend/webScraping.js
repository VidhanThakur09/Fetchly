import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as cheerio from "cheerio"; 
import "dotenv/config";

export default async function scrapeWebsite(url) {
  // Add a timeout option to the Puppeteer loader to prevent indefinite hangs
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true, // You can set this to 'new' or false for debugging
    },
    async evaluate(page, browser) {
      await page.waitForSelector("body");
      // You can add more specific waiting logic here if needed
      return page.evaluate(() => document.body.innerHTML);
    },
  });

  try {
    // 1. Load raw page content with a timeout of 30 seconds
    const result = await loader.load({
      timeout: 30000 // 30 seconds
    });
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

    // 5. Store in Qdrant
    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "chaiCode-Collection",
      apiKey: process.env.QDRANT_API_KEY,
    });

    console.log("Web scraping and indexing of data done successfully.");
  } catch (error) {
    console.error("Error during web scraping or indexing:", error);
    // You can re-throw the error or handle it as you see fit
    throw error;
  }
}
