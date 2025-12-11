import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 401 Code */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600 animate-pulse">
            401
          </h1>
          <div className="mt-4 text-2xl font-semibold text-gray-300">
            Unauthorized Access
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-red-500/30">
          <p className="text-gray-300 mb-4">
            You need to authenticate to access this resource.
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Connect your wallet or sign in to continue.
          </p>
          <div className="text-red-400 text-sm">
            🔐 Authentication Required
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/wallet"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Connect Wallet
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Go Home
          </Link>
        </div>

        {/* Decoration */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
