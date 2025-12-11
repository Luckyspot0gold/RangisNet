import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
            404
          </h1>
          <div className="mt-4 text-2xl font-semibold text-gray-300">
            Page Not Found
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30">
          <p className="text-gray-300 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm">
            Feel the blockchain at the right frequency - try navigating back home.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Return Home
        </Link>

        {/* RangisNet Branding */}
        <div className="mt-12">
          <p className="text-purple-400 font-semibold text-lg">432 Hz - The Frequency of Innovation 🎵</p>
        </div>

        {/* Decoration */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
