import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Key, LogOut, BarChart3, Zap, Globe, Lock, Moon, Sun, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalUsers: number;
  totalApiKeys: number;
  activeApiKeys: number;
  accountType: string;
}

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Fetch dashboard stats for quick overview
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="phantom-nav fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 phantom-text mr-3" />
              <span className="text-xl font-bold text-foreground">Nation Auth</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground hover:text-primary"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <Shield className="h-16 w-16 phantom-text mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Welcome back, {user?.firstName || user?.email}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Your Nation Auth dashboard is ready. Manage your API keys, monitor users, and secure your applications.
              </p>
              <Link href="/dashboard">
                <Button className="phantom-button px-8 py-4 text-lg">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="phantom-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card className="phantom-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalApiKeys || 0}</div>
                <p className="text-xs text-muted-foreground">Total generated</p>
              </CardContent>
            </Card>

            <Card className="phantom-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold success-color">{stats?.activeApiKeys || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card className="phantom-stats-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm font-medium">
                  {stats?.accountType || 'Premium'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Account type</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Authentication Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to secure your applications with enterprise-grade authentication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="phantom-card">
              <CardHeader>
                <Zap className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  High-performance authentication with minimal latency and maximum throughput for your applications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="phantom-card">
              <CardHeader>
                <Shield className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade security with encryption, hashing, and secure session management built-in.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="phantom-card">
              <CardHeader>
                <Key className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>API Management</CardTitle>
                <CardDescription>
                  Generate, manage, and secure API keys with granular permissions and real-time monitoring.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="phantom-card">
              <CardHeader>
                <Users className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Complete user lifecycle management with registration, login, and profile management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="phantom-card">
              <CardHeader>
                <Globe className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>Global Scale</CardTitle>
                <CardDescription>
                  Built to scale globally with distributed architecture and CDN support worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="phantom-card">
              <CardHeader>
                <Lock className="h-10 w-10 phantom-text mb-4" />
                <CardTitle>Secure by Default</CardTitle>
                <CardDescription>
                  Best security practices built-in with automatic updates and continuous monitoring.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 phantom-text mr-2" />
              <span className="text-lg font-semibold text-foreground">Nation Auth</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Nation Auth. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
