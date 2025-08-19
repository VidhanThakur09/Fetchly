import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your RAG-powered assistant. Upload some documents or add data, then ask me questions about them!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: new Date(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // // Simulate AI response
    // setTimeout(() => {
    //   const aiResponse: Message = {
    //     id: Date.now() + 1,
    //     text: "I understand your question. However, I need you to upload some documents or add data to the RAG store first so I can provide accurate, context-aware responses based on your content.",
    //     isUser: false,
    //     timestamp: new Date(),
    //   };
    //   setMessages(prev => [...prev, aiResponse]);
    // }, 1000);

    const response = await axios.post(`${backend}/retrive`, {userQuery: inputText })
    const aiMessage: Message = {
      id: new Date(),
      text: JSON.stringify(response.data),
      isUser: false,
      timestamp: new Date(),
    };
    setInputText("");
    setMessages(prev => [...prev, aiMessage]);
    
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <Card className="h-screen bg-gradient-subtle border-border/50 shadow-glow-subtle transition-all duration-300 hover:shadow-glow overflow-scroll  overflow-y-scroll  overflow-x-hidden">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-accent">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Chat</h2>
        </div>
        
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4 scroll-smooth" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? "bg-gradient-primary text-primary-foreground ml-12 transform hover:scale-[1.02]"
                        : "bg-muted/50 text-foreground mr-12 transform hover:scale-[1.02]"
                    } shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-glow-subtle`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <Bot className="h-4 w-4 mt-0.5 text-primary shrink-0 animate-pulse" />
                      )}
                      {message.isUser && (
                        <User className="h-4 w-4 mt-0.5 text-primary-foreground shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-2 transition-opacity duration-300 hover:opacity-90">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4 pb-6">
            <Input
              placeholder="Ask questions about your data..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
            />
            <Button
              onClick={handleSend}
              className="bg-gradient-primary hover:bg-gradient-secondary text-primary-foreground px-6 shadow-lg hover:shadow-glow transition-all duration-300 group"
            >
              <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}