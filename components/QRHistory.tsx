'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface QRCodeItem {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  scanCount: number;
  createdAt: string;
}

interface QRHistoryProps {
  refresh?: number;
}

export default function QRHistory({ refresh }: QRHistoryProps) {
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQRCodes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/qr/list?page=${page}&limit=10`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch QR codes');
      }

      setQrCodes(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [page, refresh]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full mb-4">
          <BarChart3 className="w-10 h-10 text-cyan-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No QR Codes Yet</h3>
        <p className="text-gray-600">Create your first QR code above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code History</h2>
          <p className="text-sm text-gray-600">Track and manage all your QR codes</p>
        </div>
      </div>

      <div className="grid gap-4">
        {qrCodes.map((qr) => (
          <div
            key={qr.id}
            className="group p-6 bg-gradient-to-br from-white/80 to-cyan-50/80 backdrop-blur-sm border-2 border-cyan-200 rounded-3xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-mono font-bold rounded-xl text-sm shadow-lg">
                    {qr.shortCode}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {formatDate(qr.createdAt)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Original:</span>
                    <a
                      href={qr.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1 break-all"
                      title={qr.originalUrl}
                    >
                      {truncateUrl(qr.originalUrl)}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Short URL:</span>
                    <span className="text-sm text-gray-700 font-mono bg-white/60 px-3 py-1 rounded-lg">
                      {truncateUrl(qr.shortUrl)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center px-6 py-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-200">
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {qr.scanCount}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">scans</div>
                </div>

                <Link
                  href={`/qr/${qr.id}`}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 flex items-center gap-2 font-bold transition-all duration-200"
                >
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-3 bg-white/70 border-2 border-cyan-200 rounded-2xl font-semibold hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          <span className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-3 bg-white/70 border-2 border-cyan-200 rounded-2xl font-semibold hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
