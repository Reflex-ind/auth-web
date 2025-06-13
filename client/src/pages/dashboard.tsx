import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Users, 
  Key, 
  Shield, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff,
  LogOut,
  BarChart3,
  Crown,
  Moon,
  Sun,
  Trash2,
  Settings,
  Calendar,
  BookOpen,
  Edit,
  Pause,
  Play,
  Lock,
  Unlock,
  MessageSquare,
  GitBranch,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Application {
  id: number;
  name: string;
  description: string;
  apiKey: string;
  version: string;
  isActive: boolean;
  hwidLockEnabled: boolean;
  loginSuccessMessage: string;
  loginFailedMessage: string;
  accountDisabledMessage: string;
  accountExpiredMessage: string;
  versionMismatchMessage: string;
  hwidMismatchMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface AppUser {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  isPaused: boolean;
  hwid?: string;
  expiresAt?: string;
  createdAt: string;
  lastLogin?: string;
  loginAttempts: number;
  lastLoginAttempt?: string;
}

interface DashboardStats {
  totalApplications: number;
  totalUsers: number;
  activeApplications: number;
  totalActiveSessions: number;
  totalApiRequests: number;
  accountType: string;
}

export default function Dashboard() {
  const [isNewAppDialogOpen, setIsNewAppDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newAppName, setNewAppName] = useState("");
  const [newAppDescription, setNewAppDescription] = useState("");
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    expiresAt: "",
    hwid: ""
  });
  const [isEditAppDialogOpen, setIsEditAppDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch dashboard stats
  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Fetch applications
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  // Fetch users for selected application
  const { data: appUsers = [] } = useQuery<AppUser[]>({
    queryKey: ["/api/applications", selectedApp?.id, "users"],
    enabled: !!selectedApp,
  });

  // Create application mutation
  const createApplicationMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; version?: string; hwidLockEnabled?: boolean }) => {
      return apiRequest("/api/applications", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setNewAppName("");
      setNewAppDescription("");
      setIsNewAppDialogOpen(false);
      toast({
        title: "Success",
        description: "Application created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create application",
        variant: "destructive",
      });
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: typeof newUserData) => {
      if (!selectedApp) throw new Error("No application selected");
      
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        ...(data.expiresAt && { expiresAt: new Date(data.expiresAt).toISOString() }),
        ...(data.hwid && { hwid: data.hwid })
      };

      return apiRequest(`/api/applications/${selectedApp.id}/users`, "POST", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApp?.id, "users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setNewUserData({ username: "", email: "", password: "", expiresAt: "", hwid: "" });
      setIsNewUserDialogOpen(false);
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Update application mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Application> }) => {
      return apiRequest(`/api/applications/${data.id}`, "PUT", data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setIsEditAppDialogOpen(false);
      setEditingApp(null);
      toast({
        title: "Success",
        description: "Application updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { appId: number; userId: number; updates: Partial<AppUser> }) => {
      return apiRequest(`/api/applications/${data.appId}/users/${data.userId}`, "PUT", data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApp?.id, "users"] });
      setIsEditUserDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Pause user mutation
  const pauseUserMutation = useMutation({
    mutationFn: async (data: { appId: number; userId: number }) => {
      return apiRequest(`/api/applications/${data.appId}/users/${data.userId}/pause`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApp?.id, "users"] });
      toast({
        title: "Success",
        description: "User paused successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to pause user",
        variant: "destructive",
      });
    },
  });

  // Unpause user mutation
  const unpauseUserMutation = useMutation({
    mutationFn: async (data: { appId: number; userId: number }) => {
      return apiRequest(`/api/applications/${data.appId}/users/${data.userId}/unpause`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApp?.id, "users"] });
      toast({
        title: "Success",
        description: "User unpaused successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unpause user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (data: { appId: number; userId: number }) => {
      return apiRequest(`/api/applications/${data.appId}/users/${data.userId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApp?.id, "users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/applications/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      if (selectedApp) {
        setSelectedApp(null);
      }
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete application",
        variant: "destructive",
      });
    },
  });

  const createApplication = async () => {
    if (!newAppName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an application name",
        variant: "destructive"
      });
      return;
    }
    createApplicationMutation.mutate({ name: newAppName, description: newAppDescription });
  };

  const createUser = async () => {
    if (!newUserData.username.trim() || !newUserData.email.trim() || !newUserData.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createUserMutation.mutate(newUserData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const toggleKeyVisibility = (keyId: number) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const maskKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key;
    return key.substring(0, 12) + "•".repeat(20) + key.substring(key.length - 8);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Docs
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {(user as any)?.firstName || (user as any)?.email || 'User'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary" className="text-sm font-medium">
                {dashboardStats?.accountType || 'Premium'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="phantom-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats?.totalApplications || 0}</div>
              <p className="text-xs text-muted-foreground">Total created</p>
            </CardContent>
          </Card>

          <Card className="phantom-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Across all apps</p>
            </CardContent>
          </Card>

          <Card className="phantom-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold success-color">{dashboardStats?.activeApplications || 0}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="phantom-stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats?.totalActiveSessions || 0}</div>
              <p className="text-xs text-muted-foreground">Live connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users" disabled={!selectedApp}>
              Users {selectedApp && `(${selectedApp.name})`}
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="phantom-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Applications</CardTitle>
                    <CardDescription>
                      Create and manage your authentication applications
                    </CardDescription>
                  </div>
                  <Dialog open={isNewAppDialogOpen} onOpenChange={setIsNewAppDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="phantom-button">
                        <Plus className="h-4 w-4 mr-2" />
                        New Application
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Application</DialogTitle>
                        <DialogDescription>
                          Create a new application to get an API key for authentication.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={newAppName}
                            onChange={(e) => setNewAppName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., My Game App"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={newAppDescription}
                            onChange={(e) => setNewAppDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional description..."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={createApplication} 
                          className="phantom-button"
                          disabled={createApplicationMutation.isPending}
                        >
                          {createApplicationMutation.isPending ? "Creating..." : "Create Application"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Applications</h3>
                    <p className="text-muted-foreground mb-4">Create your first application to get started</p>
                    <Button 
                      onClick={() => setIsNewAppDialogOpen(true)}
                      className="phantom-button"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Application
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app: Application) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{app.name}</div>
                              {app.description && (
                                <div className="text-sm text-muted-foreground">{app.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {maskKey(app.apiKey, visibleKeys.has(app.id))}
                          </TableCell>
                          <TableCell>
                            <Badge variant={app.isActive ? "default" : "secondary"}>
                              {app.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(app.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleKeyVisibility(app.id)}
                              >
                                {visibleKeys.has(app.id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(app.apiKey)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingApp(app);
                                  setIsEditAppDialogOpen(true);
                                }}
                                title="Edit Application"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Link href={`/app/${app.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Manage Application"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteApplicationMutation.mutate(app.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete Application"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="phantom-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users - {selectedApp?.name}</CardTitle>
                    <CardDescription>
                      Manage users for this application with time limits
                    </CardDescription>
                  </div>
                  <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="phantom-button" disabled={!selectedApp}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user for {selectedApp?.name} with optional expiration date.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            value={newUserData.username}
                            onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                            className="col-span-3"
                            placeholder="johndoe"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                            className="col-span-3"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="password" className="text-right">
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                            className="col-span-3"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="expiresAt" className="text-right">
                            Expires At
                          </Label>
                          <Input
                            id="expiresAt"
                            type="datetime-local"
                            value={newUserData.expiresAt}
                            onChange={(e) => setNewUserData({...newUserData, expiresAt: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="hwid" className="text-right">
                            Hardware ID
                          </Label>
                          <Input
                            id="hwid"
                            value={newUserData.hwid}
                            onChange={(e) => setNewUserData({...newUserData, hwid: e.target.value})}
                            className="col-span-3"
                            placeholder="Optional - will be set on first login if HWID lock enabled"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={createUser} 
                          className="phantom-button"
                          disabled={createUserMutation.isPending}
                        >
                          {createUserMutation.isPending ? "Creating..." : "Create User"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedApp ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Select an Application</h3>
                    <p className="text-muted-foreground">Choose an application from the Applications tab to manage its users</p>
                  </div>
                ) : appUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Users</h3>
                    <p className="text-muted-foreground mb-4">Create your first user for {selectedApp.name}</p>
                    <Button 
                      onClick={() => setIsNewUserDialogOpen(true)}
                      className="phantom-button"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>HWID Lock</TableHead>
                        <TableHead>Login Attempts</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appUsers.map((user: AppUser) => {
                        const isExpired = user.expiresAt && new Date() > new Date(user.expiresAt);
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={user.isActive && !isExpired && !user.isPaused ? "default" : "secondary"}
                                  className={isExpired ? "text-red-600" : user.isPaused ? "text-orange-600" : ""}
                                >
                                  {isExpired ? "Expired" : user.isPaused ? "Paused" : user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {selectedApp?.hwidLockEnabled ? (
                                  user.hwid ? (
                                    <Badge variant="default" className="text-xs">
                                      <Lock className="h-3 w-3 mr-1" />
                                      Locked
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      <Unlock className="h-3 w-3 mr-1" />
                                      Not Set
                                    </Badge>
                                  )
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    Disabled
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <span className={user.loginAttempts > 5 ? "text-red-600 font-medium" : ""}>{user.loginAttempts}</span>
                                {user.loginAttempts > 0 && (
                                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.expiresAt ? (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {formatDate(user.expiresAt)}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Never</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.lastLogin 
                                ? formatDate(user.lastLogin)
                                : <span className="text-muted-foreground">Never</span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setIsEditUserDialogOpen(true);
                                  }}
                                  title="Edit User"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {user.isPaused ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => unpauseUserMutation.mutate({ appId: selectedApp.id, userId: user.id })}
                                    title="Unpause User"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => pauseUserMutation.mutate({ appId: selectedApp.id, userId: user.id })}
                                    title="Pause User"
                                    className="text-orange-600 hover:text-orange-700"
                                  >
                                    <Pause className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteUserMutation.mutate({ appId: selectedApp.id, userId: user.id })}
                                  title="Delete User"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Application Dialog */}
        <Dialog open={isEditAppDialogOpen} onOpenChange={setIsEditAppDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Application - {editingApp?.name}</DialogTitle>
              <DialogDescription>
                Configure application settings, version control, HWID locking, and custom messages.
              </DialogDescription>
            </DialogHeader>
            {editingApp && (
              <div className="grid gap-6 py-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                    <TabsTrigger value="security">Security & HWID</TabsTrigger>
                    <TabsTrigger value="messages">Custom Messages</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">Name</Label>
                      <Input
                        id="edit-name"
                        defaultValue={editingApp.name}
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-description" className="text-right">Description</Label>
                      <Textarea
                        id="edit-description"
                        defaultValue={editingApp.description || ""}
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, description: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-version" className="text-right">
                        <GitBranch className="h-4 w-4 mr-1 inline" />
                        Version
                      </Label>
                      <Input
                        id="edit-version"
                        defaultValue={editingApp.version}
                        placeholder="1.0.0"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, version: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-active" className="text-right">Active Status</Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-active"
                          checked={editingApp.isActive}
                          onChange={(e) => setEditingApp({...editingApp, isActive: e.target.checked})}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="edit-active" className="text-sm">Application is active</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-hwid-lock" className="text-right">
                        <HardDrive className="h-4 w-4 mr-1 inline" />
                        HWID Lock
                      </Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-hwid-lock"
                          checked={editingApp.hwidLockEnabled}
                          onChange={(e) => setEditingApp({...editingApp, hwidLockEnabled: e.target.checked})}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="edit-hwid-lock" className="text-sm">Enable Hardware ID locking</Label>
                      </div>
                    </div>
                    <div className="col-span-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        When HWID lock is enabled, users will be locked to their first login device. 
                        This prevents account sharing and unauthorized access from different machines.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="messages" className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-success-msg" className="text-right">
                        <CheckCircle className="h-4 w-4 mr-1 inline text-green-600" />
                        Login Success
                      </Label>
                      <Input
                        id="edit-success-msg"
                        defaultValue={editingApp.loginSuccessMessage}
                        placeholder="Login successful!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, loginSuccessMessage: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-failed-msg" className="text-right">
                        <XCircle className="h-4 w-4 mr-1 inline text-red-600" />
                        Login Failed
                      </Label>
                      <Input
                        id="edit-failed-msg"
                        defaultValue={editingApp.loginFailedMessage}
                        placeholder="Invalid credentials!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, loginFailedMessage: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-disabled-msg" className="text-right">
                        <AlertTriangle className="h-4 w-4 mr-1 inline text-orange-600" />
                        Account Disabled
                      </Label>
                      <Input
                        id="edit-disabled-msg"
                        defaultValue={editingApp.accountDisabledMessage}
                        placeholder="Account is disabled!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, accountDisabledMessage: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-expired-msg" className="text-right">
                        <Calendar className="h-4 w-4 mr-1 inline text-red-600" />
                        Account Expired
                      </Label>
                      <Input
                        id="edit-expired-msg"
                        defaultValue={editingApp.accountExpiredMessage}
                        placeholder="Account has expired!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, accountExpiredMessage: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-version-msg" className="text-right">
                        <GitBranch className="h-4 w-4 mr-1 inline text-blue-600" />
                        Version Mismatch
                      </Label>
                      <Input
                        id="edit-version-msg"
                        defaultValue={editingApp.versionMismatchMessage}
                        placeholder="Please update your application!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, versionMismatchMessage: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-hwid-msg" className="text-right">
                        <HardDrive className="h-4 w-4 mr-1 inline text-purple-600" />
                        HWID Mismatch
                      </Label>
                      <Input
                        id="edit-hwid-msg"
                        defaultValue={editingApp.hwidMismatchMessage}
                        placeholder="Hardware ID mismatch detected!"
                        className="col-span-3"
                        onChange={(e) => setEditingApp({...editingApp, hwidMismatchMessage: e.target.value})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button 
                onClick={() => {
                  if (editingApp) {
                    updateApplicationMutation.mutate({ 
                      id: editingApp.id, 
                      updates: {
                        name: editingApp.name,
                        description: editingApp.description,
                        version: editingApp.version,
                        isActive: editingApp.isActive,
                        hwidLockEnabled: editingApp.hwidLockEnabled,
                        loginSuccessMessage: editingApp.loginSuccessMessage,
                        loginFailedMessage: editingApp.loginFailedMessage,
                        accountDisabledMessage: editingApp.accountDisabledMessage,
                        accountExpiredMessage: editingApp.accountExpiredMessage,
                        versionMismatchMessage: editingApp.versionMismatchMessage,
                        hwidMismatchMessage: editingApp.hwidMismatchMessage
                      }
                    });
                  }
                }}
                className="phantom-button"
                disabled={updateApplicationMutation.isPending}
              >
                {updateApplicationMutation.isPending ? "Updating..." : "Update Application"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User - {editingUser?.username}</DialogTitle>
              <DialogDescription>
                Update user information, status, and Hardware ID settings.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-user-username" className="text-right">Username</Label>
                  <Input
                    id="edit-user-username"
                    defaultValue={editingUser.username}
                    className="col-span-3"
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-user-email" className="text-right">Email</Label>
                  <Input
                    id="edit-user-email"
                    type="email"
                    defaultValue={editingUser.email}
                    className="col-span-3"
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-user-expires" className="text-right">Expires At</Label>
                  <Input
                    id="edit-user-expires"
                    type="datetime-local"
                    defaultValue={editingUser.expiresAt ? new Date(editingUser.expiresAt).toISOString().slice(0, 16) : ""}
                    className="col-span-3"
                    onChange={(e) => setEditingUser({...editingUser, expiresAt: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-user-hwid" className="text-right">Hardware ID</Label>
                  <Input
                    id="edit-user-hwid"
                    defaultValue={editingUser.hwid || ""}
                    className="col-span-3"
                    placeholder="Hardware ID (leave empty to reset)"
                    onChange={(e) => setEditingUser({...editingUser, hwid: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-user-active"
                        checked={editingUser.isActive}
                        onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="edit-user-active" className="text-sm">User is active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit-user-paused"
                        checked={editingUser.isPaused}
                        onChange={(e) => setEditingUser({...editingUser, isPaused: e.target.checked})}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="edit-user-paused" className="text-sm">User is paused</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                onClick={() => {
                  if (editingUser && selectedApp) {
                    updateUserMutation.mutate({ 
                      appId: selectedApp.id,
                      userId: editingUser.id, 
                      updates: {
                        username: editingUser.username,
                        email: editingUser.email,
                        isActive: editingUser.isActive,
                        isPaused: editingUser.isPaused,
                        hwid: editingUser.hwid || undefined,
                        expiresAt: editingUser.expiresAt ? editingUser.expiresAt : undefined
                      }
                    });
                  }
                }}
                className="phantom-button"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
