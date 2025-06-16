import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl); // Debug log

    if (!backendUrl) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const token = request.headers.get('authorization');
    console.log('Received token:', token ? 'Present' : 'Missing'); // Debug log

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }

    const url = `${backendUrl}/cars/admin/analytics`;
    console.log('Fetching from:', url); // Debug log

    const response = await fetch(url, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    console.log('Backend response status:', response.status); // Debug log

    // Get response as text first
    const text = await response.text();
    console.log('Backend response text:', text); // Debug log

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('JSON parse error:', e); // Debug log
      return NextResponse.json(
        { error: 'Invalid JSON response from backend', details: text.substring(0, 100) },
        { status: 502 }
      );
    }

    // If response is not ok, format the error properly
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Backend request failed', details: data.details || response.statusText },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
