import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * API route to revalidate cache tags
 */
export async function GET(request: NextRequest) {
  try {
    // Get the tag to revalidate from query params
    const tag = request.nextUrl.searchParams.get('tag');
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag parameter is required' },
        { status: 400 }
      );
    }
    
    // Revalidate the tag
    revalidateTag(tag);
    
    return NextResponse.json({
      revalidated: true,
      tag,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Revalidation error:', error);
    
    return NextResponse.json(
      {
        error: 'Error revalidating cache',
        message: error.message
      },
      { status: 500 }
    );
  }
}