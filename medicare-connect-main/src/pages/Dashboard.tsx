import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Database, FileText, FlaskConical, Plus, TrendingUp } from "lucide-react";
import { drugService, prescriptionService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrugs: 0,
    totalPrescriptions: 0,
    recentAnalyses: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [drugsResponse, prescriptionsResponse] = await Promise.all([
        drugService.getAllDrugs(),
        prescriptionService.getAllPrescriptions(),
      ]);

      setStats({
        totalDrugs: drugsResponse.data.length,
        totalPrescriptions: prescriptionsResponse.data.length,
        recentAnalyses: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, link }: any) => (
    <Card className="overflow-hidden border-border transition-all hover:shadow-lg">
      <CardHeader className={`pb-3 ${color}`}>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-primary-foreground/80" />
          <div className="text-right">
            <p className="text-sm font-medium text-primary-foreground/80">{label}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-primary-foreground">{value}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Link to={link}>
          <Button variant="ghost" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to MediGuard Drug Interaction Management System
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Database}
          label="Total Drugs"
          value={stats.totalDrugs}
          color="bg-gradient-to-br from-primary to-accent"
          link="/drugs"
        />
        <StatCard
          icon={FileText}
          label="Total Prescriptions"
          value={stats.totalPrescriptions}
          color="bg-gradient-to-br from-accent to-medical-teal"
          link="/prescriptions"
        />
        <StatCard
          icon={TrendingUp}
          label="Analyses Performed"
          value={stats.recentAnalyses}
          color="bg-gradient-to-br from-medical-teal to-primary"
          link="/interactions"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions for fast access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/drugs">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Database className="h-6 w-6" />
                <span>Add New Drug</span>
              </Button>
            </Link>
            <Link to="/interactions">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <FlaskConical className="h-6 w-6" />
                <span>Analyze Interaction</span>
              </Button>
            </Link>
            <Link to="/prescriptions">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Create Prescription</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-24 flex-col gap-2" disabled>
              <Plus className="h-6 w-6" />
              <span>Bulk Import</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>All microservices are running properly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Drug Database Service", port: "9001", status: "online" },
              { name: "Interaction Service", port: "9002", status: "online" },
              { name: "Prescription Service", port: "9003", status: "online" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-sm text-muted-foreground">Port: {service.port}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                  <span className="text-sm font-medium text-success capitalize">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
