import { useEffect, useState } from "react";
import { AlertCircle, FlaskConical } from "lucide-react";
import { drugService, interactionService } from "@/services/api";
import { Drug, InteractionResult } from "@/types/drug";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import RiskBadge from "@/components/RiskBadge";
import SeverityGauge from "@/components/SeverityGauge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Interactions() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [drugA, setDrugA] = useState<string>("");
  const [drugB, setDrugB] = useState<string>("");
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDrugs, setLoadingDrugs] = useState(true);

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
    </div>
  );
}
