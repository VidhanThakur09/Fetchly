import { Card } from "@/components/ui/card";
import { Database, ArrowRight, ArrowUp } from "lucide-react";

export function RagStore() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Incoming arrow from Data Source */}
      <div className="flex items-center">
        <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
      </div>
      
      <Card className="bg-gradient-primary border-primary/20 shadow-glow transition-all duration-300 hover:shadow-glow">
        <div className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-lg bg-primary-foreground/10">
              <Database className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-primary-foreground">RAG Store</h2>
            <p className="text-sm text-primary-foreground/80">
              Vector embeddings &<br />knowledge base
            </p>
          </div>
        </div>
      </Card>
      
      {/* Outgoing arrow to Chat */}
      <div className="flex items-center">
        <ArrowUp className="h-6 w-6 text-primary animate-pulse" />
      </div>
    </div>
  );
}