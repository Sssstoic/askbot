"use client";

import { useUserAuth } from "../firebase/auth"; 
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const { googleSignIn, gitHubSignIn, firebaseSignOut, user } = useUserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

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

  const handleSignOut = async () => {
    await firebaseSignOut();
    router.push("/"); 
  };

  const handleContinueWithoutLogin = () => {
    router.push("/pages"); 
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
              {error}  
            </div>
          )}
          <button
            onClick={() => handleSignIn(googleSignIn, "Google")}
            disabled={loading}  
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-800 mb-4"
          >
            {loading ? "Signing in with Google..." : "Sign in with Google"}
          </button>
          <button
            onClick={() => handleSignIn(gitHubSignIn, "GitHub")}
            disabled={loading}  
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-gray-800 mb-4"
          >
            {loading ? "Signing in with GitHub..." : "Sign in with GitHub"}
          </button>

          <button
            onClick={handleContinueWithoutLogin}
            className="w-full bg-transparent text-gray-700 p-3 rounded-md border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 mb-4"
          >
            Continue without logging in
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
        <p className="text-xs mt-2">Created by James Tuling</p>
      </footer>
    </div>
  );
};

export default LoginPage;
