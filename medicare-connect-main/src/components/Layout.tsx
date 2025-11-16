import { Link, useLocation } from "react-router-dom";
import { Activity, Database, FlaskConical, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Drug Database", href: "/drugs", icon: Database },
  { name: "Interaction Analyzer", href: "/interactions", icon: FlaskConical },
  { name: "Prescriptions", href: "/prescriptions", icon: FileText },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MediGuard</h1>
              <p className="text-xs text-muted-foreground">Drug Interaction System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card p-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 MediGuard. Drug Interaction Management System.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                All Services Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
