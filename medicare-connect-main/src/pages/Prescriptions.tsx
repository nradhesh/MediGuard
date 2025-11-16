import { useEffect, useState } from "react";
import { Plus, FileText, Trash2, CheckCircle, AlertCircle, Edit } from "lucide-react";
import { drugService, prescriptionService } from "@/services/api";
import { Drug, Prescription, PrescriptionItem } from "@/types/drug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<string>("");
  
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    items: [{ drugId: "", doseMg: "" }] as Array<{ drugId: string; doseMg: string }>,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let prescriptionError = false;
    let drugError = false;
    
    try {
      const [prescriptionsRes, drugsRes] = await Promise.allSettled([
        prescriptionService.getAllPrescriptions(),
        drugService.getAllDrugs(),
      ]);
      
      // Handle prescriptions result
      if (prescriptionsRes.status === 'fulfilled') {
        setPrescriptions(prescriptionsRes.value.data || []);
      } else {
        prescriptionError = true;
        setPrescriptions([]);
        console.error("Prescription service error:", prescriptionsRes.reason);
      }
      
      // Handle drugs result
      if (drugsRes.status === 'fulfilled') {
        setDrugs(drugsRes.value.data || []);
        if (drugsRes.value.data.length === 0) {
          toast.warning("No drugs available. Please add drugs first.");
        }
      } else {
        drugError = true;
        setDrugs([]);
        console.error("Drug service error:", drugsRes.reason);
      }
      
      // Show specific error messages
      if (prescriptionError && drugError) {
        toast.error("Cannot connect to Prescription Service (Port 9003) and Drug Database Service (Port 9001). Please ensure both services are running.");
      } else if (prescriptionError) {
        toast.error("Cannot connect to Prescription Service (Port 9003). Please ensure the service is running.");
      } else if (drugError) {
        toast.error("Cannot connect to Drug Database Service (Port 9001). Please ensure the service is running.");
      }
    } catch (error: any) {
      let errorMessage = "Failed to load data";
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to services. Please ensure Prescription Service (9003) and Drug Database Service (9001) are running.";
      } else if (error.response?.status === 404) {
        errorMessage = "Service endpoint not found. Please check service URLs.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Check backend service logs.";
      } else if (error.message?.includes('CORS')) {
        errorMessage = "CORS error. Please check backend CORS configuration.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      console.error("Data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { drugId: "", doseMg: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: "drugId" | "doseMg", value: string) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleValidate = async () => {
    if (!formData.patientName || !formData.doctorName) {
      toast.error("Please fill in patient and doctor names");
      return;
    }

    const validItems = formData.items.filter((item) => item.drugId && item.doseMg);
    if (validItems.length === 0) {
      toast.error("Please add at least one drug");
      return;
    }

    setValidating(true);
    try {
      const prescriptionData = {
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        items: validItems.map((item) => ({
          drugId: Number(item.drugId),
          doseMg: Number(item.doseMg),
        })),
      };

      const response = await prescriptionService.validatePrescription(prescriptionData);
      setValidationResult(response.data);
      toast.success("Validation complete");
    } catch (error) {
      toast.error("Validation failed");
      console.error(error);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = formData.items.filter((item) => item.drugId && item.doseMg);
    if (validItems.length === 0) {
      toast.error("Please add at least one drug");
      return;
    }

    try {
      const prescriptionData = {
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        items: validItems.map((item) => ({
          drugId: Number(item.drugId),
          doseMg: Number(item.doseMg),
        })),
      };

      if (editingPrescription && editingPrescription.id) {
        await prescriptionService.updatePrescription(editingPrescription.id, prescriptionData);
        toast.success("Prescription updated successfully");
      } else {
        await prescriptionService.createPrescription(prescriptionData);
        toast.success("Prescription created successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(editingPrescription ? "Failed to update prescription" : "Failed to create prescription");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    try {
      await prescriptionService.deletePrescription(id);
      toast.success("Prescription deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete prescription");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingPrescription(null);
    setFormData({
      patientName: "",
      doctorName: "",
      items: [{ drugId: "", doseMg: "" }],
    });
    setValidationResult("");
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      patientName: prescription.patientName,
      doctorName: prescription.doctorName,
      items: prescription.items.length > 0
        ? prescription.items.map((item) => ({
            drugId: item.drugId.toString(),
            doseMg: item.doseMg?.toString() || "",
          }))
        : [{ drugId: "", doseMg: "" }],
    });
    setDialogOpen(true);
  };

  const getDrugName = (drugId: number) => {
    return drugs.find((d) => d.id === drugId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescription Management</h1>
          <p className="text-muted-foreground">Create and manage patient prescriptions</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Prescription
        </Button>
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-40 bg-muted" />
            </Card>
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No prescriptions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{prescription.patientName}</CardTitle>
                    <CardDescription className="mt-1">
                      Dr. {prescription.doctorName}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {prescription.items.length} {prescription.items.length === 1 ? "drug" : "drugs"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {prescription.createdAt && (
                  <p className="text-sm text-muted-foreground">
                    Created: {format(new Date(prescription.createdAt), "PPP")}
                  </p>
                )}
                
                <div>
                  <p className="text-sm font-medium mb-2">Medications:</p>
                  <div className="space-y-1">
                    {prescription.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        • {getDrugName(item.drugId)} - {item.doseMg}mg
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.interactionSummary && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium flex items-center gap-2 mb-1">
                      <AlertCircle className="h-3 w-3" />
                      Interaction Summary
                    </p>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {prescription.interactionSummary}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(prescription)}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => prescription.id && handleDelete(prescription.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPrescription ? "Edit Prescription" : "Create New Prescription"}</DialogTitle>
            <DialogDescription>
              {editingPrescription 
                ? "Update patient details and medications"
                : "Enter patient details and add medications to the prescription"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="patient">Patient Name *</Label>
                <Input
                  id="patient"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="doctor">Doctor Name *</Label>
                <Input
                  id="doctor"
                  value={formData.doctorName}
                  onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Medications</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Drug
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    value={item.drugId}
                    onValueChange={(value) => handleItemChange(index, "drugId", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select drug" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugs.map((drug) => (
                        <SelectItem key={drug.id} value={drug.id.toString()}>
                          {drug.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Dose (mg)"
                    value={item.doseMg}
                    onChange={(e) => handleItemChange(index, "doseMg", e.target.value)}
                    className="w-32"
                  />
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {validationResult && (
              <Card className="border-warning/50 bg-warning/5">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    {validationResult.toLowerCase().includes("safe") ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                    Validation Result
                  </p>
                  <p className="text-sm text-muted-foreground">{validationResult}</p>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleValidate}
                disabled={validating}
              >
                {validating ? "Validating..." : "Validate"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingPrescription ? "Update Prescription" : "Create Prescription"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
