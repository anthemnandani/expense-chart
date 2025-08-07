"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { DollarSign, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignInPage() {
  const { user, loading, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("SignIn - cookies:", document.cookie);
    const match = document.cookie.match(/user_email=([^;]+)/);
    const rawEmail = match?.[1];

    if (rawEmail && !user && !loading) {
      console.log("Cookie found, waiting for user state");
      return; // Wait for AuthProvider to set user
    }

    if (!loading && user) {
      console.log("User found, redirecting to /");
      router.push("/");
    }
  }, [loading, user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signed in successfully");
        setUser(data.user);
        router.push("/");
      } else {
        if (res.status === 404) {
          toast.warning("User not found! Redirecting to register page...");
          setTimeout(() => {
            window.location.href = "https://essentials.workanthem.com/userRegister";
          }, 2000);
        }
        else {
          setError(data.error || "Sign in failed");
          toast.error(data.error || "Sign in failed");
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("Network error. Please try again.");
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = "https://essentials.workanthem.com/userRegister";
  };

  function toggleViewPassword() {
    if (showPassword == false) {
      setShowPassword(true);
      console.log("true");
    } else {
      setShowPassword(false);
      console.log("false");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          </div>
          <p className="text-gray-600">Track your expenses with ease</p>
        </div>
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your expense tracker
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <div
                    className=""
                    onClick={toggleViewPassword}
                  >
                    {showPassword ? <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-400" /> : <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400" />}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="flex justify-center items-center w-full cursor-pointer">
              <div
                className="flex border gap-2 rounded w-full justify-center items-center px-6 py-2"
                onClick={() => {
                  window.location.href = "/api/auth/google";
                }}
              >
                <Image src="/images/google.png" alt="Google" width={24} height={24} />
                <div className="google">Sign In with Google</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Button>
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Button
                  variant="link"
                  onClick={handleRegisterRedirect}
                  className="text-blue-600 hover:text-blue-700 p-0"
                >
                  Sign Up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Copyright © 2025 Anthem Infotech Private Limited. All rights reserved.</p>
          <p className="mt-1">Powered by Anthem Infotech Pvt. Ltd.</p>
        </div>
      </div>
    </div>
  );
}