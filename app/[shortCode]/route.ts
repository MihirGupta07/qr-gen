import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QRCode from '@/models/QRCode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    await connectDB();

    const qrCode = await QRCode.findOne({ shortCode });

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    // Capture scan metadata
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      undefined;

    // Record the scan
    qrCode.scans.push({
      timestamp: new Date(),
      userAgent,
      ipAddress,
    });
    qrCode.scanCount += 1;

    await qrCode.save();

    // Redirect to the original URL
    return NextResponse.redirect(qrCode.originalUrl, 302);
  } catch (error) {
    console.error('Error tracking scan:', error);
    return NextResponse.json(
      { error: 'Failed to track scan' },
      { status: 500 }
    );
  }
}
