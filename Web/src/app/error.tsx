'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  const statusCode = (error as any).statusCode || 500;
  const is401 = statusCode === 401;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
            {statusCode}
          </h1>
          <div className="mt-4 text-2xl font-semibold text-gray-300">
            {is401 ? 'Unauthorized Access' : 'Something Went Wrong'}
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30">
          <p className="text-gray-300 mb-4">
            {is401 
              ? "You don't have permission to access this resource. Please authenticate or check your credentials."
              : error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
        </div>

        {/* Decoration */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
