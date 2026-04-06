"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  let errorMessage = "An unexpected error occurred.";
  let actionSteps = "Please try refreshing the page or check back later.";

  try {
    // Try to parse if it's our custom FirestoreErrorInfo JSON
    const parsedError = JSON.parse(error.message);
    if (parsedError.error) {
      const rawError = parsedError.error.toLowerCase();
      
      if (rawError.includes("missing or insufficient permissions")) {
        errorMessage = "You don't have permission to perform this action.";
        actionSteps = "Please ensure you are logged in with the correct account. If you are trying to access admin features, make sure you are using your admin email.";
      } else if (rawError.includes("offline") || rawError.includes("network")) {
        errorMessage = "Network connection issue.";
        actionSteps = "Please check your internet connection and try again.";
      } else if (rawError.includes("quota exceeded")) {
        errorMessage = "Database quota exceeded.";
        actionSteps = "The daily limit for database operations has been reached. Please try again tomorrow.";
      } else {
        errorMessage = parsedError.error;
      }
    }
  } catch (e) {
    // Not a JSON string, fallback to standard error message parsing
    const rawError = error.message.toLowerCase();
    if (rawError.includes("missing or insufficient permissions")) {
      errorMessage = "You don't have permission to perform this action.";
      actionSteps = "Please ensure you are logged in with the correct account.";
    } else if (rawError.includes("offline") || rawError.includes("network") || rawError.includes("failed to fetch")) {
      errorMessage = "Network connection issue.";
      actionSteps = "Please check your internet connection and try again.";
    } else if (rawError.includes("quota exceeded")) {
      errorMessage = "Database quota exceeded.";
      actionSteps = "The daily limit for database operations has been reached. Please try again tomorrow.";
    } else {
      errorMessage = error.message || "An unexpected error occurred.";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-red-600 font-medium mb-4 bg-red-50 p-3 rounded-xl text-sm">
          {errorMessage}
        </p>
        <p className="text-slate-600 mb-8 text-sm leading-relaxed">
          {actionSteps}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
