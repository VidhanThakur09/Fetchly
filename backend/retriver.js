import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from 'openai';
import "dotenv/config";


 const client = new OpenAI({
   apiKey: process.env.GEMINI_API_KEY,
   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
 });

export default async function chat(userQuery){

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004", // 768 dimensions
      // taskType: TaskType.RETRIEVAL_DOCUMENT,
      // title: "Document title",
    });


    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: "chaiCode-Collection",
        apiKey: process.env.QDRANT_API_KEY,
      }
    );

    const vectorSearcher = vectorStore.asRetriever({
        k:3,
    });

    const releventChunks = await vectorSearcher.invoke(userQuery);


    const systemPromt = `
        you are an AI assistant who helps resolving user query base on the context available to you from a PDF file with the content and page number.

        only ans base on the available context from the file only.
        
        context:${JSON.stringify(releventChunks)}

        output formate: 
         - Always give the output in string formate and with there page numbers.
         - when providing the Code output always add the code block in next line and when exiting the code block make a space and formate it like in code editor.
        - should follow the examples and give output base on the examples.
        - don't use \n for next line just give answer in para form.
        - if you got any code block as 

        examples:
          - user asks safety we should follow?
          - output "Some personal safety tips include: Trust your gut, bring a friend along, stay in safe spaces, watch your drink, protect your money, speak up if you feel uncomfortable, focus on your future, surround yourself with positivity, build a strong circle, and keep a cool head (Page 1)."
          -user what is node js?
          - output "Node.js is a runtime environment for JavaScript that runs on the server. Node.js is open source, cross-platform, and since its introduction in 2009, it got hugely popular and now plays a significant role in the web development scene (Page 6)."
    
    `
    let response = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: systemPromt,
            },
            {
                role: "user",
                content: userQuery,
            }
        ],
    });
    return response.choices[0].message.content;
}   
// chat("what is LangChain?");