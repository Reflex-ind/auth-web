import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogIn, CheckCircle, Info, Users, Building } from "lucide-react";
import { Link, useLocation } from "wouter";
import { GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { auth, handleRedirectResult } from "@/lib/firebase";
import { User } from "firebase/auth";

const firebaseLoginSchema = z.object({});

export default function FirebaseLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof firebaseLoginSchema>>({
    resolver: zodResolver(firebaseLoginSchema),
    defaultValues: {},
  });

  useEffect(() => {
    let authenticationInProgress = false;

    handleRedirectResult()
      .then((result) => {
        if (result && !authenticationInProgress) {
          authenticationInProgress = true;
          setUser(result.user);
          authenticateWithBackend(result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error);
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive",
        });
        setLoading(false);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !loading && !authenticationInProgress && !authenticating) {
        authenticationInProgress = true;
        setUser(user);
        authenticateWithBackend(user);
      } else if (!user) {
        setUser(null);
        authenticationInProgress = false;
      }
    });

    return () => unsubscribe();
  }, []);

  const authenticateWithBackend = async (firebaseUser: User) => {
    if (authenticating) return;

    setAuthenticating(true);
    setLoading(true);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_token: token,
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          display_name: firebaseUser.displayName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Login successful! Redirecting...",
          variant: "default",
        });

        localStorage.setItem("account_id", result.account_id);
        localStorage.setItem("account_email", firebaseUser.email || "");
        localStorage.setItem("firebase_uid", firebaseUser.uid);

        setTimeout(() => {
          setLocation("/");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Backend authentication error:", error);
      toast({
        title: "Error",
        description: "Failed to authenticate with backend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // ✅ Yeh fix lagaya gaya hai yahan
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate Google login",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Welcome to Nation Auth!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium text-sm">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">{user.displayName || "User"}</p>
                    <p className="text-sm text-blue-700">{user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-blue-800">You are now logged in with Firebase authentication.</p>
              </div>

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 primary-color mr-3" />
            <span className="text-2xl font-bold text-gray-900">Nation Auth</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Sign in with Google to access your authentication environment</p>
        </div>

        <Card className="professional-card shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-xl font-semibold">
              <Building className="h-5 w-5 mr-2 primary-color" />
              Multi-Tenant Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="professional-card bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">Enterprise Authentication System</p>
                    <p className="text-sm text-gray-700">
                      Each Google account creates its own isolated authentication environment with unique API keys and user management.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full professional-button py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
