"use client";

import { useUserAuth } from "./firebase/auth"; // Updated import path for useUserAuth
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const { googleSignIn, gitHubSignIn, firebaseSignOut, user } = useUserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const handleGoogleSignIn = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      await googleSignIn();
      router.push("/pages"); // Redirect after successful login to /pages
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setError("Failed to sign in with Google. Please try again."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      await gitHubSignIn();
      router.push("/pages"); // Redirect after successful login to /pages
    } catch (error) {
      console.error("GitHub Sign-In error:", error);
      setError("Failed to sign in with GitHub. Please try again."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
    router.push("/"); // Redirect to login page after sign-out
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-green-800 dark:bg-green-900 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/images/askbotlogo.jpg" alt="AskBot Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-white">AskBot</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Login</h2>
          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded-md mb-4">
              {error}  {/* Display error message */}
            </div>
          )}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}  // Disable when loading
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-800 mb-4"
          >
            {loading ? "Signing in with Google..." : "Sign in with Google"}
          </button>
          <button
            onClick={handleGitHubSignIn}
            disabled={loading}  // Disable when loading
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-gray-800 mb-4"
          >
            {loading ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </button>
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 mt-4"
            >
              Sign out
            </button>
          )}
        </div>
      </main>

      <footer className="bg-green-900 dark:bg-green-800 p-4 text-white text-center text-sm">
        &copy; 2024 AskBot. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
