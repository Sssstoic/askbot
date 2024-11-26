"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Yow, what can I help you with today?" }
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark"); 
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode ? "dark" : "light";
      localStorage.setItem("theme", newMode);
      document.documentElement.classList.toggle("dark", !prevMode);
      return !prevMode;
    });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
  
    const newUserMessage = {
      role: "user",
      content: question,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setQuestion("");
    setLoading(true);
  
    try {
      // Direct API call to OpenAI using the new gpt-3.5-turbo model
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Ensure the API key is correct
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Updated model
          messages: [{ role: "user", content: question }],
          max_tokens: 150, // Optional, limit the response length
          temperature: 0.7, // Optional, control the randomness of the output
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        throw new Error("Failed to fetch from API");
      }
  
      const data = await response.json();
      const message = data.choices[0].message.content.trim(); // 'message' for gpt-3.5-turbo model
  
      // Add the bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: message, role: "bot" },
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching from API:", error.message || error);
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-green-800 dark:bg-green-900 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/images/askbotlogo.jpg" alt="AskBot Logo" className="h-12" />
          <h1 className="text-3xl font-bold text-white">AskBot</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:shadow-md"
            aria-label="Toggle Light/Dark Mode"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-500" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl">
          <div className="h-[500px] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-green-200 dark:bg-green-700 text-green-900 dark:text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center">
                  <Loader2 className="animate-spin mr-2 text-green-800 dark:text-green-400" />
                  <span className="text-gray-900 dark:text-white">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleQuestionSubmit} className="flex">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-grow p-3 rounded-l-md border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-800"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-800 dark:bg-green-700 text-white p-3 rounded-r-md hover:bg-green-900 dark:hover:bg-green-600 disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-green-900 dark:bg-green-800 p-4 text-white text-center text-sm">
        &copy; 2024 AskBot. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
