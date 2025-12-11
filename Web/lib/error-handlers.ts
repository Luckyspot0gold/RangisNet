/**
 * Error handling utilities for RangisNet
 */

import { redirect } from 'next/navigation';

/**
 * Throw a 401 error that will be caught by the error boundary
 */
export function throw401(message?: string) {
  const error = new Error(message || 'Unauthorized access');
  (error as any).statusCode = 401;
  throw error;
}

/**
 * Redirect to unauthorized page
 */
export function redirectToUnauthorized() {
  redirect('/unauthorized');
}

/**
 * Check if user is authenticated and throw 401 if not
 */
export function requireAuth(isAuthenticated: boolean, message?: string) {
  if (!isAuthenticated) {
    throw401(message);
  }
}

/**
 * Create a 401 Response for API routes
 */
export function create401Response(message?: string) {
  return new Response(
    JSON.stringify({
      error: 'Unauthorized',
      message: message || 'Authentication required',
      statusCode: 401
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create a 404 Response for API routes
 */
export function create404Response(message?: string) {
  return new Response(
    JSON.stringify({
      error: 'Not Found',
      message: message || 'Resource not found',
      statusCode: 404
    }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create a 500 Response for API routes
 */
export function create500Response(message?: string) {
  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
      message: message || 'An unexpected error occurred',
      statusCode: 500
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
