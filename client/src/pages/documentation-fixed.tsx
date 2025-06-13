import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Code, Copy, LogOut, Moon, Sun, Book, Zap, Users, Lock } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function Documentation() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <Book className="h-16 w-16 phantom-text mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete integration guide for Nation Auth API. Learn how to implement secure authentication in your C# WinForms applications with HWID locking, version control, and blacklist management.
            </p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <Card className="phantom-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 phantom-text mr-2" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running with Nation Auth in 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Step 1: Create an Application</h3>
                <p className="text-muted-foreground mb-2">
                  Go to your dashboard and create a new application to get your API key.
                </p>
                <Link href="/dashboard">
                  <Button className="phantom-button">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 2: Get Your API Key</h3>
                <p className="text-muted-foreground">
                  After creating an application, copy the API key from your dashboard. You'll need this for all API requests.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 3: Start Making API Calls</h3>
                <p className="text-muted-foreground">
                  Use the API endpoints below to register users, authenticate them, and manage sessions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* C# WinForms Complete Implementation */}
        <Card className="phantom-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 phantom-text mr-2" />
              Complete C# WinForms Implementation
            </CardTitle>
            <CardDescription>
              Full implementation with HWID locking, version control, and error handling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete PhantomAuth Class</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Management;
using System.Security.Cryptography;
using Newtonsoft.Json;

public class PhantomAuth
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly string _appVersion;

    public PhantomAuth(string apiKey, string appVersion = "1.0.0", string baseUrl = "${window.location.origin}/api/v1")
    {
        _apiKey = apiKey;
        _baseUrl = baseUrl;
        _appVersion = appVersion;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("X-API-Key", apiKey);
    }

    public static string GetHardwareId()
    {
        try
        {
            string hwid = "";
            
            ManagementObjectSearcher mos = new ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor");
            foreach (ManagementObject mo in mos.Get())
            {
                hwid += mo["ProcessorId"].ToString();
            }
            
            mos = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard");
            foreach (ManagementObject mo in mos.Get())
            {
                hwid += mo["SerialNumber"].ToString();
            }
            
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(hwid));
                return Convert.ToBase64String(hash).Substring(0, 32);
            }
        }
        catch
        {
            return "HWID-FALLBACK-" + Environment.MachineName;
        }
    }

    public async Task<AuthResponse> LoginAsync(string username, string password, bool includeHwid = true)
    {
        var data = new { 
            username, 
            password, 
            api_key = _apiKey,
            version = _appVersion,
            hwid = includeHwid ? GetHardwareId() : null
        };
        
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/login", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }

    public async Task<AuthResponse> RegisterAsync(string username, string email, string password, DateTime? expiresAt = null)
    {
        var data = new { 
            username, 
            email, 
            password, 
            expiresAt,
            hwid = GetHardwareId()
        };
        
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/register", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }

    public async Task<AuthResponse> VerifySessionAsync(int userId)
    {
        var data = new { user_id = userId };
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/verify", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }
}

public class AuthResponse
{
    [JsonProperty("success")]
    public bool Success { get; set; }
    
    [JsonProperty("message")]
    public string Message { get; set; }
    
    [JsonProperty("user_id")]
    public int? UserId { get; set; }
    
    [JsonProperty("username")]
    public string Username { get; set; }
    
    [JsonProperty("email")]
    public string Email { get; set; }
    
    [JsonProperty("expires_at")]
    public DateTime? ExpiresAt { get; set; }
    
    [JsonProperty("hwid_locked")]
    public bool? HwidLocked { get; set; }
}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Management;
using System.Security.Cryptography;
using Newtonsoft.Json;

public class PhantomAuth
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl;
    private readonly string _appVersion;

    public PhantomAuth(string apiKey, string appVersion = "1.0.0", string baseUrl = "${window.location.origin}/api/v1")
    {
        _apiKey = apiKey;
        _baseUrl = baseUrl;
        _appVersion = appVersion;
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("X-API-Key", apiKey);
    }

    public static string GetHardwareId()
    {
        try
        {
            string hwid = "";
            
            ManagementObjectSearcher mos = new ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor");
            foreach (ManagementObject mo in mos.Get())
            {
                hwid += mo["ProcessorId"].ToString();
            }
            
            mos = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard");
            foreach (ManagementObject mo in mos.Get())
            {
                hwid += mo["SerialNumber"].ToString();
            }
            
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(hwid));
                return Convert.ToBase64String(hash).Substring(0, 32);
            }
        }
        catch
        {
            return "HWID-FALLBACK-" + Environment.MachineName;
        }
    }

    public async Task<AuthResponse> LoginAsync(string username, string password, bool includeHwid = true)
    {
        var data = new { 
            username, 
            password, 
            api_key = _apiKey,
            version = _appVersion,
            hwid = includeHwid ? GetHardwareId() : null
        };
        
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/login", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }

    public async Task<AuthResponse> RegisterAsync(string username, string email, string password, DateTime? expiresAt = null)
    {
        var data = new { 
            username, 
            email, 
            password, 
            expiresAt,
            hwid = GetHardwareId()
        };
        
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/register", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }

    public async Task<AuthResponse> VerifySessionAsync(int userId)
    {
        var data = new { user_id = userId };
        var json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync($"{_baseUrl}/verify", content);
        var responseJson = await response.Content.ReadAsStringAsync();
        
        return JsonConvert.DeserializeObject<AuthResponse>(responseJson);
    }
}

public class AuthResponse
{
    [JsonProperty("success")]
    public bool Success { get; set; }
    
    [JsonProperty("message")]
    public string Message { get; set; }
    
    [JsonProperty("user_id")]
    public int? UserId { get; set; }
    
    [JsonProperty("username")]
    public string Username { get; set; }
    
    [JsonProperty("email")]
    public string Email { get; set; }
    
    [JsonProperty("expires_at")]
    public DateTime? ExpiresAt { get; set; }
    
    [JsonProperty("hwid_locked")]
    public bool? HwidLocked { get; set; }
}`}
                </pre>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete WinForms Login Implementation</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`// In your WinForms LoginForm
public partial class LoginForm : Form
{
    private PhantomAuth _auth;
    private const string API_KEY = "your_api_key_here";
    private const string APP_VERSION = "1.0.0";

    public LoginForm()
    {
        InitializeComponent();
        _auth = new PhantomAuth(API_KEY, APP_VERSION);
    }

    private async void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {
            btnLogin.Enabled = false;
            btnLogin.Text = "Logging in...";

            string username = txtUsername.Text.Trim();
            string password = txtPassword.Text;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                MessageBox.Show("Please enter both username and password.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            AuthResponse result = await _auth.LoginAsync(username, password, true);

            if (result.Success)
            {
                Properties.Settings.Default.UserId = result.UserId ?? 0;
                Properties.Settings.Default.Username = result.Username;
                Properties.Settings.Default.Save();

                MessageBox.Show(result.Message, "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                
                MainForm mainForm = new MainForm();
                mainForm.Show();
                this.Hide();
            }
            else
            {
                HandleLoginError(result.Message);
            }
        }
        catch (HttpRequestException ex)
        {
            MessageBox.Show("Network error: Unable to connect to authentication server.\\n\\nDetails: " + ex.Message, 
                          "Connection Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        catch (Exception ex)
        {
            MessageBox.Show("An unexpected error occurred:\\n\\n" + ex.Message, 
                          "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            btnLogin.Enabled = true;
            btnLogin.Text = "Login";
        }
    }

    private void HandleLoginError(string message)
    {
        string errorTitle = "Login Failed";
        MessageBoxIcon icon = MessageBoxIcon.Error;

        if (message.Contains("version") || message.Contains("update"))
        {
            errorTitle = "Update Required";
            icon = MessageBoxIcon.Warning;
            DialogResult result = MessageBox.Show(
                message + "\\n\\nWould you like to download the latest version?",
                errorTitle, MessageBoxButtons.YesNo, icon);
            
            if (result == DialogResult.Yes)
            {
                System.Diagnostics.Process.Start("https://yourwebsite.com/download");
            }
            Application.Exit();
        }
        else if (message.Contains("hardware") || message.Contains("HWID"))
        {
            errorTitle = "Hardware Mismatch";
            icon = MessageBoxIcon.Warning;
            MessageBox.Show("This account is locked to a different computer!", errorTitle, MessageBoxButtons.OK, icon);
        }
        else if (message.Contains("expired"))
        {
            errorTitle = "Account Expired";
            icon = MessageBoxIcon.Warning;
        }
        else if (message.Contains("disabled") || message.Contains("paused"))
        {
            errorTitle = "Account Disabled";
            icon = MessageBoxIcon.Warning;
        }
        else if (message.Contains("blacklisted") || message.Contains("blocked"))
        {
            errorTitle = "Access Blocked";
            icon = MessageBoxIcon.Stop;
            MessageBox.Show("Access denied. Contact support if you believe this is an error.", errorTitle, MessageBoxButtons.OK, icon);
            Application.Exit();
        }

        MessageBox.Show(message, errorTitle, MessageBoxButtons.OK, icon);
    }

    private async void LoginForm_Load(object sender, EventArgs e)
    {
        // Auto-login check
        int savedUserId = Properties.Settings.Default.UserId;
        if (savedUserId > 0)
        {
            try
            {
                AuthResponse verifyResult = await _auth.VerifySessionAsync(savedUserId);
                if (verifyResult.Success)
                {
                    MainForm mainForm = new MainForm();
                    mainForm.Show();
                    this.Hide();
                    return;
                }
            }
            catch
            {
                Properties.Settings.Default.UserId = 0;
                Properties.Settings.Default.Save();
            }
        }
        
        // Show HWID for debugging
        lblHwid.Text = "HWID: " + PhantomAuth.GetHardwareId();
    }
}

// Required NuGet packages:
// Install-Package Newtonsoft.Json
// Install-Package System.Management`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`// In your WinForms LoginForm
public partial class LoginForm : Form
{
    private PhantomAuth _auth;
    private const string API_KEY = "your_api_key_here";
    private const string APP_VERSION = "1.0.0";

    public LoginForm()
    {
        InitializeComponent();
        _auth = new PhantomAuth(API_KEY, APP_VERSION);
    }

    private async void btnLogin_Click(object sender, EventArgs e)
    {
        try
        {
            btnLogin.Enabled = false;
            btnLogin.Text = "Logging in...";

            string username = txtUsername.Text.Trim();
            string password = txtPassword.Text;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                MessageBox.Show("Please enter both username and password.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            AuthResponse result = await _auth.LoginAsync(username, password, true);

            if (result.Success)
            {
                Properties.Settings.Default.UserId = result.UserId ?? 0;
                Properties.Settings.Default.Username = result.Username;
                Properties.Settings.Default.Save();

                MessageBox.Show(result.Message, "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                
                MainForm mainForm = new MainForm();
                mainForm.Show();
                this.Hide();
            }
            else
            {
                HandleLoginError(result.Message);
            }
        }
        catch (HttpRequestException ex)
        {
            MessageBox.Show("Network error: Unable to connect to authentication server.\\n\\nDetails: " + ex.Message, 
                          "Connection Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        catch (Exception ex)
        {
            MessageBox.Show("An unexpected error occurred:\\n\\n" + ex.Message, 
                          "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
        finally
        {
            btnLogin.Enabled = true;
            btnLogin.Text = "Login";
        }
    }

    private void HandleLoginError(string message)
    {
        string errorTitle = "Login Failed";
        MessageBoxIcon icon = MessageBoxIcon.Error;

        if (message.Contains("version") || message.Contains("update"))
        {
            errorTitle = "Update Required";
            icon = MessageBoxIcon.Warning;
            DialogResult result = MessageBox.Show(
                message + "\\n\\nWould you like to download the latest version?",
                errorTitle, MessageBoxButtons.YesNo, icon);
            
            if (result == DialogResult.Yes)
            {
                System.Diagnostics.Process.Start("https://yourwebsite.com/download");
            }
            Application.Exit();
        }
        else if (message.Contains("hardware") || message.Contains("HWID"))
        {
            errorTitle = "Hardware Mismatch";
            icon = MessageBoxIcon.Warning;
            MessageBox.Show("This account is locked to a different computer!", errorTitle, MessageBoxButtons.OK, icon);
        }
        else if (message.Contains("expired"))
        {
            errorTitle = "Account Expired";
            icon = MessageBoxIcon.Warning;
        }
        else if (message.Contains("disabled") || message.Contains("paused"))
        {
            errorTitle = "Account Disabled";
            icon = MessageBoxIcon.Warning;
        }
        else if (message.Contains("blacklisted") || message.Contains("blocked"))
        {
            errorTitle = "Access Blocked";
            icon = MessageBoxIcon.Stop;
            MessageBox.Show("Access denied. Contact support if you believe this is an error.", errorTitle, MessageBoxButtons.OK, icon);
            Application.Exit();
        }

        MessageBox.Show(message, errorTitle, MessageBoxButtons.OK, icon);
    }

    private async void LoginForm_Load(object sender, EventArgs e)
    {
        // Auto-login check
        int savedUserId = Properties.Settings.Default.UserId;
        if (savedUserId > 0)
        {
            try
            {
                AuthResponse verifyResult = await _auth.VerifySessionAsync(savedUserId);
                if (verifyResult.Success)
                {
                    MainForm mainForm = new MainForm();
                    mainForm.Show();
                    this.Hide();
                    return;
                }
            }
            catch
            {
                Properties.Settings.Default.UserId = 0;
                Properties.Settings.Default.Save();
            }
        }
        
        // Show HWID for debugging
        lblHwid.Text = "HWID: " + PhantomAuth.GetHardwareId();
    }
}

// Required NuGet packages:
// Install-Package Newtonsoft.Json
// Install-Package System.Management`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card className="phantom-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 phantom-text mr-2" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Complete API documentation with request/response examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Base URL:</strong> {window.location.origin}/api/v1<br />
                <strong>Database:</strong> PostgreSQL (Neon) - Permanently configured<br />
                <strong>Authentication:</strong> Include your API key in the X-API-Key header
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">POST /register</h4>
                <p className="text-muted-foreground mb-4">Register a new user in your application</p>
                <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "expiresAt": "2024-12-31T23:59:59Z",
  "hwid": "optional-hardware-id"
}`}
                </pre>
                <Badge variant="secondary" className="mt-2">Response: 200 OK</Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">POST /login</h4>
                <p className="text-muted-foreground mb-4">Authenticate user with username, password, version, and HWID</p>
                <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`{
  "username": "johndoe",
  "password": "securepassword123",
  "api_key": "your_api_key",
  "version": "1.0.0",
  "hwid": "hardware-id-string"
}`}
                </pre>
                <Badge variant="secondary" className="mt-2">Response: 200 OK</Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">POST /verify</h4>
                <p className="text-muted-foreground mb-4">Verify if a user session is still valid</p>
                <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`{
  "user_id": 123
}`}
                </pre>
                <Badge variant="secondary" className="mt-2">Response: 200 OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Summary */}
        <Card className="phantom-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 phantom-text mr-2" />
              Advanced Features
            </CardTitle>
            <CardDescription>
              All authentication features included in Nation Auth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Security Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Hardware ID (HWID) locking</li>
                  <li>• Application version control</li>
                  <li>• Account expiration dates</li>
                  <li>• User pause/disable functionality</li>
                  <li>• Blacklist system (IP, HWID, username, email)</li>
                  <li>• Activity logging and monitoring</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Management Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time dashboard</li>
                  <li>• User management interface</li>
                  <li>• Application settings</li>
                  <li>• Custom error messages</li>
                  <li>• Webhook notifications</li>
                  <li>• Session tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Best Practices */}
        <Card className="phantom-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 phantom-text mr-2" />
              Implementation Guide
            </CardTitle>
            <CardDescription>
              Step-by-step setup instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Setup Your Application</h4>
                <p className="text-muted-foreground">Create an application in the dashboard and get your API key</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install Required Packages</h4>
                <p className="text-muted-foreground">Install Newtonsoft.Json and System.Management NuGet packages</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Add PhantomAuth Class</h4>
                <p className="text-muted-foreground">Copy the complete PhantomAuth class to your project</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Implement Login Form</h4>
                <p className="text-muted-foreground">Use the provided WinForms implementation with error handling</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. Configure Features</h4>
                <p className="text-muted-foreground">Enable HWID locking, set version requirements, and configure custom messages in dashboard</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6. Test Authentication</h4>
                <p className="text-muted-foreground">Create test users and verify all features work correctly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
