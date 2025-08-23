import { DataSource } from "@/components/DataSource";
import { FileUpload } from "@/components/FileUpload";
import { LinkUpload } from "@/components/LinkUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { RagStore } from "@/components/RagStore";
import { useEffect } from "react";
import axios from "axios";

const Index = () => {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const clearDatabase = async () => {
      try {
        await axios.post(`${backend}/delete`);
        console.log("Database cleared successfully on initial load.");
      } catch (error) {
        console.error("Failed to clear database:", error);
      }
    };
    clearDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2 pb-2">
            Fetchly
          </h1>
          <p className="text-muted-foreground">
            Upload documents, add data, and chat with your AI assistant
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column - Data Source */}
          <div className="lg:col-span-4 flex flex-col">
            <DataSource />
          </div>

          {/* Center Column - RAG Store and Upload Components */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex-1 flex items-center justify-center">
              <RagStore />
            </div>
            <div className="grid grid-cols-1 gap-4 h-fit">
              <FileUpload />
              <LinkUpload />
            </div>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-4 flex flex-col">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
