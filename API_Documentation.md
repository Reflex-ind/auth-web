# PhantomAuth API Documentation

## Overview
PhantomAuth is a comprehensive authentication system with support for user management, hardware ID locking, version control, blacklisting, and real-time webhook notifications.

## Base URL
```
https://your-replit-url.replit.dev/api/v1
```

## Authentication
All API requests require an API key in the header:
```
X-API-Key: your-api-key-here
```

## API Endpoints

### 1. User Login
**Endpoint:** `POST /login`

**Description:** Authenticates a user with comprehensive security checks including version verification, HWID locking, and blacklist validation.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "api_key": "string",
  "version": "string (optional)",
  "hwid": "string (optional)"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "user_id": number,
  "username": "string",
  "email": "string",
  "expires_at": "datetime",
  "hwid_locked": boolean,
  "required_version": "string (if version mismatch)",
  "current_version": "string (if version mismatch)"
}
```

**Security Features:**
- Version checking (triggers `version_mismatch` webhook)
- Hardware ID locking (triggers `hwid_mismatch` webhook)
- IP address blacklist checking (triggers `login_blocked_ip` webhook)
- Username blacklist checking (triggers `login_blocked_username` webhook)
- HWID blacklist checking (triggers `login_blocked_hwid` webhook)
- Account status validation (triggers `account_disabled` or `account_expired` webhooks)

### 2. User Registration
**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "expiresAt": "datetime (optional)",
  "hwid": "string (optional)"
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "user_id": number
}
```

### 3. Session Verification
**Endpoint:** `POST /verify`

**Request Body:**
```json
{
  "user_id": number
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",
  "user_id": number,
  "username": "string",
  "email": "string",
  "expires_at": "datetime"
}
```

## Webhook System

### Supported Events
- `user_login` - Successful login
- `login_failed` - Failed login attempt
- `user_register` - New user registration
- `account_disabled` - Login attempt on disabled account
- `account_expired` - Login attempt on expired account
- `version_mismatch` - Login with incorrect application version
- `hwid_mismatch` - Hardware ID mismatch detected
- `login_blocked_ip` - Login blocked due to IP blacklist
- `login_blocked_username` - Login blocked due to username blacklist
- `login_blocked_hwid` - Login blocked due to HWID blacklist

### Webhook Payload Format
```json
{
  "event": "string",
  "timestamp": "ISO8601 datetime",
  "application_id": number,
  "success": boolean,
  "error_message": "string (if applicable)",
  "user_data": {
    "id": number,
    "username": "string",
    "email": "string",
    "hwid": "string",
    "ip_address": "string",
    "user_agent": "string"
  },
  "metadata": {
    "login_time": "ISO8601 datetime",
    "version": "string",
    "hwid_locked": boolean
  }
}
```

### Discord Webhook Format
When using Discord webhooks, payloads are automatically formatted as Discord embeds with:
- Color coding (green for success, red for errors)
- Event-specific emojis
- Organized field display
- Application ID in footer

## C# Integration

### Installation Requirements
```xml
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
<PackageReference Include="System.Management" Version="7.0.2" />
```

### Basic Usage

#### 1. Initialize PhantomAuth
```csharp
var auth = new PhantomAuth("your-api-key", "1.0.0", "https://your-replit-url.replit.dev/api/v1");
```

#### 2. Simple Login
```csharp
var response = await auth.LoginAsync("username", "password");
if (response.Success)
{
    // Login successful
    Console.WriteLine($"Welcome, {response.Username}!");
}
else
{
    // Handle error
    Console.WriteLine($"Login failed: {response.Message}");
}
```

#### 3. Login with Automatic Error Handling
```csharp
// This method automatically shows appropriate dialog boxes for different error types
var response = await auth.LoginWithErrorHandlingAsync("username", "password");
```

#### 4. Manual Error Handling
```csharp
var response = await auth.LoginAsync("username", "password");
if (!response.Success)
{
    auth.HandleLoginError(response.Message);
}
```

### Error Handling Features

The `HandleLoginError` method provides intelligent error handling:

- **Version Mismatch**: Shows update dialog with download option
- **Hardware Mismatch**: Displays HWID lock notification
- **Account Expired**: Shows expiration message
- **Account Disabled**: Displays account status message
- **Blacklist/Blocked**: Shows access denied message and exits application

### Advanced Features

#### Hardware ID Generation
```csharp
string hwid = PhantomAuth.GetHardwareId();
```

#### Registration
```csharp
var response = await auth.RegisterAsync("username", "email@example.com", "password");
```

#### Session Verification
```csharp
var response = await auth.VerifySessionAsync(userId);
```

### Complete Integration Example

```csharp
private async void LoginButton_Click(object sender, EventArgs e)
{
    try
    {
        var auth = new PhantomAuth("your-api-key");
        var response = await auth.LoginWithErrorHandlingAsync(
            usernameTextBox.Text, 
            passwordTextBox.Text
        );
        
        if (response.Success)
        {
            // Store session information
            CurrentUser.Id = response.UserId.Value;
            CurrentUser.Username = response.Username;
            CurrentUser.Email = response.Email;
            
            // Navigate to main application
            this.Hide();
            var mainForm = new MainForm();
            mainForm.Show();
        }
    }
    catch (Exception ex)
    {
        MessageBox.Show($"Connection error: {ex.Message}", "Error", 
            MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}
```

## Security Best Practices

### 1. API Key Management
- Store API keys securely (encrypted config files, environment variables)
- Never hardcode API keys in source code
- Use different API keys for development and production

### 2. Hardware ID Implementation
- The system automatically generates unique hardware IDs
- HWID locking prevents account sharing across devices
- Fallback mechanism ensures reliability

### 3. Version Control
- Always send application version with login requests
- Use semantic versioning (e.g., "1.0.0")
- Implement automatic update mechanisms

### 4. Error Handling
- Use the built-in error handling methods
- Implement proper user feedback for all error scenarios
- Log authentication events for security monitoring

## Dashboard Features

### Application Management
- Create and manage multiple applications
- Configure application settings (version, messages, HWID locking)
- Monitor real-time statistics

### User Management
- View all registered users
- Manually disable/enable accounts
- Set account expiration dates
- Reset hardware IDs

### Blacklist System
- Block users by IP address, username, or HWID
- Add reasons for blacklist entries
- Enable/disable blacklist entries

### Webhook Configuration
- Set up Discord or custom webhook endpoints
- Configure webhook secrets for security
- Select specific events to monitor
- Test webhook functionality

### Activity Monitoring
- Real-time activity logs
- Filter by application or user
- Monitor login success rates
- Track security events

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Verify API key is correct
   - Check that API key header is included
   - Ensure application is active

2. **"Version Mismatch"**
   - Update application version
   - Check version string format
   - Verify version in application settings

3. **"Hardware ID Mismatch"**
   - Reset HWID in user management
   - Check if HWID locking is enabled
   - Verify hardware ID generation

4. **"Access Denied/Blacklisted"**
   - Check blacklist entries
   - Verify IP address isn't blocked
   - Contact administrator

### Debug Mode
Enable debug logging by adding console output:
```csharp
// Add this before making API calls
Console.WriteLine($"Attempting login for: {username}");
Console.WriteLine($"Hardware ID: {PhantomAuth.GetHardwareId()}");
```

## Rate Limiting
- Login attempts: 5 per minute per IP
- Registration: 3 per hour per IP
- API calls: 100 per minute per API key

## Support
For technical support or questions:
- Check the activity logs in the dashboard
- Verify webhook configurations
- Review blacklist entries
- Monitor application statistics

This documentation covers all aspects of the PhantomAuth system. The system provides enterprise-grade security features with simple integration for C# applications.
