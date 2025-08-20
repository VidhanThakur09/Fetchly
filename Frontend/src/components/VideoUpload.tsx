import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Video, Plus, X, Upload } from "lucide-react";
import axios from "axios";

export const VideoUpload = () => {
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState("");
  const { toast } = useToast();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [loading, setLoading] = useState(false);

  const addVideoLink = () => {
    if (!currentLink.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid video URL",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(currentLink);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid video URL",
        variant: "destructive"
      });
      return;
    }

    setVideoLinks([...videoLinks, currentLink]);
    setCurrentLink("");
    toast({
      title: "Video link added",
      description: "Video link has been added to the list"
    });
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const handleUpload = async() => {
    setLoading(true);
    if (videoLinks.length === 0) {
      toast({
        title: "No videos",
        description: "Please add at least one video link",
        variant: "destructive"
      });
      return;
    }

    for (const video of videoLinks) {
      await axios.post(`${backend}/scrape`, { url: video });
    }

    toast({
      title: "Success",
      description: `${videoLinks.length} video link(s) processed and added to RAG store`
    });
    setVideoLinks([]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addVideoLink();
    }
  };

  return (
    <Card className="h-full bg-gradient-subtle border-border/50 shadow-glow-subtle hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="h-5 w-5 text-primary" />
          {!loading?"Video Links":<span className="animate-pulse">Uploading...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Input Section */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Website URL"
              value={currentLink}
              onChange={(e) => setCurrentLink(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-background/50 border-border/50 focus:bg-background transition-colors"
            />
            <Button 
              onClick={addVideoLink}
              size="sm"
              className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow-subtle"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Links List */}
        {videoLinks.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {videoLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-background/30 rounded-md border border-border/30 group hover:bg-background/50 transition-colors"
              >
                <span className="text-sm text-foreground/80 truncate flex-1 mr-2">
                  {link}
                </span>
                <Button
                  onClick={() => removeVideoLink(index)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={videoLinks.length === 0}
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow-subtle disabled:opacity-50 disabled:shadow-none transition-all duration-300"
        >
          <Upload className="h-4 w-4 mr-2" />
          Process Video Links ({videoLinks.length})
        </Button>
      </CardContent>
    </Card>
  );
};