"use client";

import { useUserAuth } from "../firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const { googleSignIn, gitHubSignIn, firebaseSignOut, user } = useUserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle sign-in with a specific provider
  const handleSignIn = async (signInMethod, signInProvider) => {
    setLoading(true);
    setError(null);
    try {
      await signInMethod();
      router.push("/pages");
    } catch (error) {
      console.error(`${signInProvider} Sign-In error:`, error);
      setError(`Failed to sign in with ${signInProvider}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.error("Sign-Out error:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  // Handle continue without login
  const handleContinueWithoutLogin = () => {
    router.push("/pages");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-green-800 dark:bg-green-900 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/images/askbotlogo.jpg" alt="AskBot Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-white">AskBot</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Login
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={() => handleSignIn(googleSignIn, "Google")}
            disabled={loading}
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-800 mb-4 transition-colors"
          >
            {loading ? "Signing in with Google..." : "Sign in with Google"}
          </button>

          {/* GitHub Sign-In Button */}
          <button
            onClick={() => handleSignIn(gitHubSignIn, "GitHub")}
            disabled={loading}
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-gray-800 mb-4 transition-colors"
          >
            {loading ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </button>

          {/* Continue Without Login Button */}
          <button
            onClick={handleContinueWithoutLogin}
            className="w-full bg-transparent text-gray-700 dark:text-gray-300 p-3 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 mb-4 transition-colors"
          >
            Continue without logging in
          </button>

          {/* Sign Out Button (Visible if user is logged in) */}
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 mt-4 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 dark:bg-green-800 p-4 text-white text-center text-sm">
        &copy; 2024 AskBot. All rights reserved.
        <p className="text-xs mt-2">Created by James Tuling</p>
      </footer>
    </div>
  );
};

export default LoginPage;