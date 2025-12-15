import { useEffect, useState, useRef } from "react";
import { AlertCircle, FlaskConical, Send, Bot, User } from "lucide-react";
import { drugService, interactionService } from "@/services/api";
import { Drug, InteractionResult } from "@/types/drug";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import RiskBadge from "@/components/RiskBadge";
import SeverityGauge from "@/components/SeverityGauge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Interactions() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [drugA, setDrugA] = useState<string>("");
  const [drugB, setDrugB] = useState<string>("");
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDrugs, setLoadingDrugs] = useState(true);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDrugs();
  }, []);

  const loadDrugs = async () => {
    try {
      const response = await drugService.getAllDrugs();
      setDrugs(response.data);
      if (response.data.length === 0) {
        toast.warning("No drugs available. Please add drugs first.");
      }
    } catch (error: any) {
      let errorMessage = "Failed to load drugs";
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to Drug Database Service (Port 9001). Please ensure the service is running.";
      } else if (error.response?.status === 404) {
        errorMessage = "Drug service endpoint not found.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error in Drug Database Service.";
      } else if (error.message?.includes('CORS')) {
        errorMessage = "CORS error. Please check backend CORS configuration.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      console.error("Drug loading error:", error);
    } finally {
      setLoadingDrugs(false);
    }
  };

  const handleAnalyze = async () => {
    if (!drugA || !drugB) {
      toast.error("Please select both drugs");
      return;
    }

    if (drugA === drugB) {
      toast.error("Please select two different drugs");
      return;
    }

    setLoading(true);
    try {
      const response = await interactionService.analyzeInteraction(
        Number(drugA),
        Number(drugB)
      );
      setResult(response.data);
      
      // Check if the result indicates a service error
      if (response.data.message?.includes("could not be fetched")) {
        toast.warning("Analysis completed, but some drug data may be missing. Check backend services.");
      } else {
        toast.success("Analysis completed");
      }
    } catch (error: any) {
      let errorMessage = "Failed to analyze interaction";
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to Interaction Service (Port 9002). Please ensure the service is running and registered with Eureka.";
      } else if (error.response?.status === 404) {
        errorMessage = "Interaction service endpoint not found.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error in Interaction Service. It may not be able to reach Drug Database Service.";
      } else if (error.response?.status === 503) {
        errorMessage = "Interaction Service is unavailable. Check if Drug Database Service is running (required dependency).";
      } else if (error.message?.includes('CORS')) {
        errorMessage = "CORS error. Please check backend CORS configuration.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Request timed out. Interaction Service may be slow or Drug Database Service is not responding.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      console.error("Interaction analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    
    // Add user message to chat
    const newUserMessage: ChatMessage = { role: "user", content: userMessage };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setChatLoading(true);

    try {
      const response = await interactionService.chat(userMessage);
      const assistantMessage: ChatMessage = { 
        role: "assistant", 
        content: response.data.response 
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later."
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get response from AI assistant");
      console.error("Chat error:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Drug Interaction Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze potential interactions between two drugs
        </p>
      </div>

      {/* Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Select Drugs to Analyze
          </CardTitle>
          <CardDescription>
            Choose two drugs to check for potential interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Drug A</label>
              <Select value={drugA} onValueChange={setDrugA} disabled={loadingDrugs}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingDrugs ? "Loading..." : "Select first drug"} />
                </SelectTrigger>
                <SelectContent>
                  {drugs.map((drug) => (
                    <SelectItem key={drug.id} value={drug.id.toString()}>
                      {drug.name} ({drug.dosageMg}mg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Drug B</label>
              <Select value={drugB} onValueChange={setDrugB} disabled={loadingDrugs}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingDrugs ? "Loading..." : "Select second drug"} />
                </SelectTrigger>
                <SelectContent>
                  {drugs.map((drug) => (
                    <SelectItem key={drug.id} value={drug.id.toString()}>
                      {drug.name} ({drug.dosageMg}mg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!drugA || !drugB || loading}
            className="w-full h-12 text-base gap-2"
            size="lg"
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <FlaskConical className="h-5 w-5" />
                Analyze Interaction
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-2 animate-in slide-in-from-bottom duration-500">
          <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Analysis Results</CardTitle>
                <CardDescription className="text-base">
                  Interaction between <strong>{result.drugA}</strong> and{" "}
                  <strong>{result.drugB}</strong>
                </CardDescription>
              </div>
              <RiskBadge level={result.riskLevel} />
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <SeverityGauge score={result.severityScore} />

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Detailed Analysis
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {result.message}
              </div>
            </div>

            {result.riskLevel !== "SAFE" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This drug combination requires medical supervision. Please consult with a
                  healthcare professional before use.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Select two drugs and click "Analyze Interaction" to see results
            </p>
          </CardContent>
        </Card>
      )}

      {/* AI Chat Interface */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Drug Interaction Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about drug interactions, side effects, and medication safety
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Start a conversation about drug interactions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Example: "What are the interactions between Paracetamol and Ibuprofen?"
                  </p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleChatKeyPress}
              placeholder="Ask about drug interactions..."
              className="min-h-[80px] resize-none"
              disabled={chatLoading}
            />
            <Button
              onClick={handleChatSend}
              disabled={!chatInput.trim() || chatLoading}
              size="lg"
              className="self-end"
            >
              {chatLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
