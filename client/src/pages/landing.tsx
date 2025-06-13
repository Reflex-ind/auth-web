import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Globe, Users, Key, Lock, Moon, Sun, CheckCircle, Database, Activity, Bell, Code, Smartphone, Rocket, ShieldCheck } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import AdvancedParticleBackground from "@/components/AdvancedParticleBackground";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLogin = () => {
    window.location.href = "/firebase-login";
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 300);
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  const featureCategories = [
    {
      title: "🔐 Core Authentication Features",
      icon: <Shield className="h-6 w-6" />,
      features: [
        "User Registration & Login – Full user management system",
        "API Key Authentication – Secure access control for API usage",
        "Session Management – Real-time session tracking and verification",
        "Password Hashing – Industry-standard encryption for secure password storage"
      ]
    },
    {
      title: "🛡️ Advanced Security Features",
      icon: <ShieldCheck className="h-6 w-6" />,
      features: [
        "Hardware ID (HWID) Locking – Prevent account sharing across multiple devices",
        "Application Version Control – Force updates to the latest version",
        "Account Expiration System – Set expiry durations for user accounts",
        "User Pause/Disable System – Temporarily or permanently deactivate users",
        "Blacklist System – Block users by IP Address, Username, Email, HWID"
      ]
    },
    {
      title: "📊 Management & Monitoring",
      icon: <Activity className="h-6 w-6" />,
      features: [
        "Real-Time Dashboard – Complete admin control panel",
        "User Management Interface – Add, edit, or remove users",
        "Application Settings – Modify and configure app behavior",
        "Activity Logging – Track all user actions and events",
        "Live Statistics – View login stats, user activity, and more",
        "Rate Limiting – Prevent abuse and bot attacks"
      ]
    },
    {
      title: "🔔 Notification System",
      icon: <Bell className="h-6 w-6" />,
      features: [
        "Webhook Support – Get notified instantly on user events",
        "Discord Integration – Get alerts directly in your Discord server",
        "Custom Webhooks – Connect with any URL for external integrations",
        "Real-time notifications for login/logout, failed attempts, violations"
      ]
    },
    {
      title: "🔧 Developer Features",
      icon: <Code className="h-6 w-6" />,
      features: [
        "RESTful API – Clean, well-structured JSON responses",
        "C# Integration – Full WinForms support with working examples",
        "Multi-Language Support – Integrate easily with multiple coding languages",
        "Comprehensive Documentation – Detailed API docs with examples",
        "Ready-to-Use Code Samples – Fast and easy implementation",
        "Smart Error Handling – Clear and informative error messages"
      ]
    },
    {
      title: "📱 User Interface",
      icon: <Smartphone className="h-6 w-6" />,
      features: [
        "Modern Dashboard – Sleek, responsive UI",
        "Dark/Light Theme – Easy theme switching",
        "Mobile Responsive – Works seamlessly on all screen sizes",
        "Live Updates – Instant data refresh without reloading"
      ]
    },
    {
      title: "🚀 Performance Features",
      icon: <Rocket className="h-6 w-6" />,
      features: [
        "High-Speed Authentication – Ultra-low latency responses",
        "Scalable Architecture – Built to support multiple applications",
        "Optimized Database – Fast and efficient queries",
        "Efficient Session Handling – Robust and secure session flow"
      ]
    },
    {
      title: "🔒 Enterprise-Level Security",
      icon: <Database className="h-6 w-6" />,
      features: [
        "Bank-Grade Encryption – Industry-standard security practices",
        "HTTPS-Only API Communication – Ensures data integrity and protection",
        "Token-Based Authentication – Secure session management",
        "Multi-Level Access Control – Role-based permission system"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AdvancedParticleBackground />
      <div className={`relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Navigation */}
        <nav className="phantom-nav fixed w-full top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Shield className="h-8 w-8 phantom-text mr-3" />
                <span className="text-2xl font-bold text-foreground">Nation Auth</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-foreground hover:text-primary"
                >
                  {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
                <Button 
                  onClick={handleLogin}
                  className="phantom-button px-6 py-2"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 animate-ping">
                  <Shield className="h-16 w-16 phantom-text opacity-30" />
                </div>
                <Shield className="h-16 w-16 phantom-text animate-float gpu-accelerated" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in gpu-accelerated">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
                  Nation Auth
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-delay">
                Secure, scalable authentication API for your applications. 
                Create users, manage API keys, and authenticate with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
                <Button 
                  onClick={handleLogin}
                  className="phantom-button px-8 py-4 text-lg gpu-accelerated group relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-white gpu-accelerated group relative overflow-hidden"
                >
                  <span className="relative z-10">View Documentation</span>
                  <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Powerful Authentication Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to secure your applications with enterprise-grade authentication
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Zap className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Lightning Fast</CardTitle>
                  <CardDescription>
                    High-performance authentication with minimal latency and maximum throughput
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Shield className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Enterprise Security</CardTitle>
                  <CardDescription>
                    Bank-grade security with encryption, hashing, and secure session management
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Key className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">API Key Management</CardTitle>
                  <CardDescription>
                    Generate, manage, and secure API keys with granular permissions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Users className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">User Management</CardTitle>
                  <CardDescription>
                    Complete user lifecycle management with registration, login, and profiles
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Globe className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Global Scale</CardTitle>
                  <CardDescription>
                    Built to scale globally with distributed architecture and CDN support
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="phantom-card gpu-accelerated group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="relative">
                    <Lock className="h-10 w-10 phantom-text mb-4 group-hover:animate-smooth-bounce transition-all duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">Secure by Default</CardTitle>
                  <CardDescription>
                    Best security practices built-in with automatic updates and monitoring
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold phantom-text mb-2 animate-pulse">99.9%</div>
                <div className="text-lg text-muted-foreground">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold phantom-text mb-2 animate-pulse">&lt;50ms</div>
                <div className="text-lg text-muted-foreground">Average Response</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold phantom-text mb-2 animate-pulse">24/7</div>
                <div className="text-lg text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Complete Feature Overview
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join thousands of developers who trust Nation Auth for their authentication needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featureCategories.map((category, index) => (
                <Card key={index} className="phantom-card hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="phantom-text">{category.icon}</div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 phantom-text mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                onClick={handleLogin}
                className="phantom-button px-8 py-4 text-lg hover:scale-105 transition-transform"
              >
                Start Building Now
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background/80 backdrop-blur-md border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}
