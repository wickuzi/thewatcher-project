import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedOrigins = [
  'https://thewatcher-project.vercel.app',
  'http://localhost:3000',
  // Add other allowed origins if needed
];

export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin ? allowedOrigins.includes(origin) : false;
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  if (isAllowedOrigin && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  return headers;
}

export function withCors(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(req),
      });
    }

    // Handle actual requests
    try {
      const response = await handler(req);
      
      // Add CORS headers to the response
      Object.entries(corsHeaders(req)).forEach(([key, value]) => {
        if (value) response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      const response = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      
      // Add CORS headers to error responses
      Object.entries(corsHeaders(req)).forEach(([key, value]) => {
        if (value) response.headers.set(key, value);
      });
      
      return response;
    }
  };
}
