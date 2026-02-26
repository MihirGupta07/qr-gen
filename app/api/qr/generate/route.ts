import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QRCode from '@/models/QRCode';
import { generateQRCode } from '@/lib/qr-generator';
import { generateUniqueShortCode, isValidUrl } from '@/lib/short-url';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, format = 'png' } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL or text is required' },
        { status: 400 }
      );
    }

    // Validate URL format if it looks like a URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!isValidUrl(url)) {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Generate unique short code
    const shortCode = await generateUniqueShortCode();

    // Create the scan URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const scanUrl = `${baseUrl}/api/scan/${shortCode}`;

    // Generate QR code image
    const qrImageData = await generateQRCode(scanUrl, { format: format as 'png' | 'svg' });

    // Save to database
    const qrCode = await QRCode.create({
      shortCode,
      originalUrl: url,
      qrImageData,
      scans: [],
      scanCount: 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: qrCode._id,
        shortCode,
        shortUrl: scanUrl,
        qrImage: qrImageData,
        originalUrl: url,
        scanCount: 0,
        createdAt: qrCode.createdAt,
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
