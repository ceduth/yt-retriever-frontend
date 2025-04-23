import { NextResponse } from 'next/server';

// Get the external API URL from environment variables
const externalApiUrl = process.env.EXTERNAL_API_URL || 'http://localhost:8000';

/**
 * This is a catch-all API route that forwards any requests to the external API
 * All HTTP methods are supported, and the path is preserved
 */
export async function GET(request, { params }) {
  const { path } = await params
  return handleRequest(request, 'GET', path);
}

export async function POST(request, { params }) {
  const { path } = await params
  return handleRequest(request, 'POST', path);
}

export async function PUT(request, { params }) {
  const { path } = await params
  return handleRequest(request, 'PUT', path);
}

export async function PATCH(request, { params }) {
  const { path } = await params
  return handleRequest(request, 'PATCH', path);
}

export async function DELETE(request, { params }) {
  const { path } = await params
  return handleRequest(request, 'DELETE', path);
}

/**
 * Generic request handler that forwards requests to the external API
 */
async function handleRequest(request, method, pathSegments) {
  try {
    // Reconstruct the path from the path segments
    const path = pathSegments?.join('/');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const queryPart = queryString ? `?${queryString}` : '';
    
    // Create the full URL for the external API
    const url = `${externalApiUrl}/${path}${queryPart}`;
    
    // Prepare request options
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    };
    
    // Add body for methods that support it
    // Forward form data or text based on content type
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        options.body = JSON.stringify(await request.json());
      } else if (contentType && contentType.includes('multipart/form-data')) {
        options.body = await request.formData();
      } else {
        options.body = await request.text();
      }
    }

    // Forward the request to the external API
    console.log(`Forwarding ${method} request to: ${url}`);
    const response = await fetch(url, options);

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else if (contentType && contentType.includes('text/')) {
      data = await response.text();
      return new NextResponse(data, { 
        status: response.status,
        headers: { 'Content-Type': contentType }
      });
    } else {
      // Binary data or other formats
      data = await response.arrayBuffer();
      return new NextResponse(data, { 
        status: response.status,
        headers: { 'Content-Type': contentType || 'application/octet-stream' }
      });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to external API', message: error.message },
      { status: 500 }
    );
  }
}

// Support OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Define which HTTP methods this API route will handle
export const runtime = 'edge'; // Optional: Use Edge runtime for better performance