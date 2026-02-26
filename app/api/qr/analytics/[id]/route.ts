import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import QRCode from '@/models/QRCode';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const qrCode = await QRCode.findById(id).lean();

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Group scans by date for timeline
    const scansByDate: { [key: string]: number } = {};
    qrCode.scans.forEach((scan) => {
      const date = new Date(scan.timestamp).toISOString().split('T')[0];
      scansByDate[date] = (scansByDate[date] || 0) + 1;
    });

    const timeline = Object.entries(scansByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get recent scans (last 10)
    const recentScans = qrCode.scans
      .slice(-10)
      .reverse()
      .map((scan) => ({
        timestamp: scan.timestamp,
        userAgent: scan.userAgent,
        ipAddress: scan.ipAddress,
      }));

    return NextResponse.json({
      success: true,
      data: {
        id: qrCode._id,
        shortCode: qrCode.shortCode,
        shortUrl: `${baseUrl}/api/scan/${qrCode.shortCode}`,
        originalUrl: qrCode.originalUrl,
        qrImage: qrCode.qrImageData,
        scanCount: qrCode.scanCount,
        createdAt: qrCode.createdAt,
        timeline,
        recentScans,
      },
    });
  } catch (error) {
    console.error('Error fetching QR code analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
