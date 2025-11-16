import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react";
import { drugService } from "@/services/api";
import { Drug } from "@/types/drug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Drugs() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    dosageMg: "",
    sideEffects: "",
  });
  const [bulkData, setBulkData] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    loadDrugs();
  }, []);

  useEffect(() => {
    const filtered = drugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrugs(filtered);
  }, [searchTerm, drugs]);

  const loadDrugs = async () => {
    try {
      const response = await drugService.getAllDrugs();
      setDrugs(response.data);
      setFilteredDrugs(response.data);
    } catch (error: any) {
      let errorMessage = "Failed to load drugs";
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = "Cannot connect to Drug Database Service. Please ensure the service is running on port 9001.";
      } else if (error.response?.status === 404) {
        errorMessage = "Drug service endpoint not found. Please check the service URL.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error occurred. Please check the backend logs.";
      } else if (error.message?.includes('CORS')) {
        errorMessage = "CORS error. Please ensure CORS is configured in the backend service.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      console.error("Drug loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const drugData = {
        name: formData.name,
        category: formData.category,
        dosageMg: Number(formData.dosageMg),
        sideEffects: formData.sideEffects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingDrug) {
        await drugService.updateDrug(editingDrug.id, drugData);
        toast.success("Drug updated successfully");
      } else {
        await drugService.createDrug(drugData);
        toast.success("Drug created successfully");
      }

      setDialogOpen(false);
      resetForm();
      loadDrugs();
    } catch (error) {
      toast.error("Failed to save drug");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this drug?")) return;

    try {
      await drugService.deleteDrug(id);
      toast.success("Drug deleted successfully");
      loadDrugs();
    } catch (error) {
      toast.error("Failed to delete drug");
      console.error(error);
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setFormData({
      name: drug.name,
      category: drug.category,
      dosageMg: drug.dosageMg.toString(),
      sideEffects: drug.sideEffects.join(", "),
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingDrug(null);
    setFormData({ name: "", category: "", dosageMg: "", sideEffects: "" });
  };

  const handleBulkImport = async () => {
    if (!bulkData.trim()) {
      toast.error("Please enter drug data");
      return;
    }

    setBulkLoading(true);
    try {
      // Parse JSON array
      const drugs = JSON.parse(bulkData);
      
      if (!Array.isArray(drugs)) {
        toast.error("Data must be an array of drugs");
        return;
      }

      // Validate and transform data
      const validDrugs = drugs.map((drug: any) => ({
        name: drug.name || "",
        category: drug.category || "",
        dosageMg: Number(drug.dosageMg) || 0,
        sideEffects: Array.isArray(drug.sideEffects) 
          ? drug.sideEffects 
          : (typeof drug.sideEffects === "string" 
              ? drug.sideEffects.split(",").map((s: string) => s.trim()).filter(Boolean)
              : []),
      }));

      await drugService.bulkCreateDrugs(validDrugs);
      toast.success(`Successfully imported ${validDrugs.length} drugs`);
      setBulkDialogOpen(false);
      setBulkData("");
      loadDrugs();
    } catch (error: any) {
      if (error.response?.status === 400 || error.message?.includes("JSON")) {
        toast.error("Invalid JSON format. Please check your data.");
      } else {
        toast.error("Failed to import drugs");
      }
      console.error(error);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drug Database</h1>
          <p className="text-muted-foreground">Manage your drug inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBulkDialogOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Drug
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search drugs by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Drugs Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
            </Card>
          ))}
        </div>
      ) : filteredDrugs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            {searchTerm ? (
              <>
                <p className="text-muted-foreground">No drugs match your search: "{searchTerm}"</p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">No drugs found in database</p>
                <p className="text-sm text-muted-foreground">
                  The database might be empty. Check the backend logs for "Sample drugs inserted" message.
                </p>
                <Button variant="outline" onClick={loadDrugs}>
                  Refresh
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDrugs.map((drug) => (
            <Card key={drug.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{drug.name}</span>
                  <Badge variant="secondary">{drug.category}</Badge>
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  {drug.dosageMg} mg
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Side Effects:</p>
                  <div className="flex flex-wrap gap-1">
                    {drug.sideEffects.length > 0 ? (
                      drug.sideEffects.map((effect, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">None listed</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(drug)}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDelete(drug.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDrug ? "Edit Drug" : "Add New Drug"}</DialogTitle>
            <DialogDescription>
              {editingDrug
                ? "Update the drug information below."
                : "Enter the details of the new drug."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Drug Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dosage">Dosage (mg) *</Label>
              <Input
                id="dosage"
                type="number"
                value={formData.dosageMg}
                onChange={(e) => setFormData({ ...formData, dosageMg: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sideEffects">Side Effects (comma-separated)</Label>
              <Input
                id="sideEffects"
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                placeholder="e.g., Nausea, Headache, Dizziness"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingDrug ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Drugs</DialogTitle>
            <DialogDescription>
              Paste a JSON array of drugs. Each drug should have: name, category, dosageMg, and sideEffects (array or comma-separated string).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulkData">JSON Data</Label>
              <Textarea
                id="bulkData"
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={`[\n  {\n    "name": "Drug Name",\n    "category": "Category",\n    "dosageMg": 500,\n    "sideEffects": ["Effect1", "Effect2"]\n  }\n]`}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Example format:</strong>
                <br />
                {`[{"name":"Aspirin","category":"Painkiller","dosageMg":300,"sideEffects":["Bleeding","Upset stomach"]}]`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport} disabled={bulkLoading}>
              {bulkLoading ? "Importing..." : "Import Drugs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
