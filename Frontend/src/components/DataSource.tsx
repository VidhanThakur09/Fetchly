import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Database, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
// import "dotenv/config";

export function DataSource() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleSubmit = async() => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to submit",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    // await axios.post(`${backend}/delete`);
    await axios.post(`${backend}/humaninput`, {humanInputText:text })
      .then(() => {
        toast({
          title: "Success",
          description: "Data submitted to RAG store",
        });
        
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        toast({
          title: "Error",
          description: "Failed to submit data to RAG store",
          variant: "destructive",
        });
      });
    setText("");
    setLoading(false);
  };

  return (
    <Card className="h-screen bg-gradient-subtle border-border/50 shadow-glow-subtle transition-all duration-300 hover:shadow-glow">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Data Source</h2>
          <span className="text-md text-red-500 font-bold  animate-pulse">{loading ? "Loading..." : ""}</span>
        </div>
        
        <div className="flex-1 flex flex-col gap-4">
          <Textarea
            placeholder="Enter your text data here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 min-h-[200px] resize-none bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
          />
          
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-primary hover:bg-gradient-secondary text-primary-foreground font-medium shadow-lg hover:shadow-glow transition-all duration-300 group"
          >
            <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
}