import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QRCode from '@/models/QRCode';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    const [qrCodes, total] = await Promise.all([
      QRCode.find()
        .select('shortCode originalUrl scanCount createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      QRCode.countDocuments(),
    ]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const formattedQRCodes = qrCodes.map((qr) => ({
      id: qr._id,
      shortCode: qr.shortCode,
      shortUrl: `${baseUrl}/api/scan/${qr.shortCode}`,
      originalUrl: qr.originalUrl,
      scanCount: qr.scanCount,
      createdAt: qr.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedQRCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    );
  }
}
