'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';

interface AnalyticsData {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  qrImage: string;
  scanCount: number;
  createdAt: string;
  timeline: { date: string; count: number }[];
  recentScans: {
    timestamp: string;
    userAgent?: string;
    ipAddress?: string;
  }[];
}

interface AnalyticsProps {
  qrId: string;
}

export default function Analytics({ qrId }: AnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/qr/analytics/${qrId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch analytics');
        }

        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [qrId]);

  const handleCopy = async () => {
    if (data) {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const link = document.createElement('a');
    link.href = data.qrImage;
    link.download = `qr-code-${data.shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <Loader2 className="w-10 h-10 text-cyan-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 text-white font-semibold text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass p-8 rounded-3xl border-2 border-red-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Analytics</h3>
            <p className="text-red-700">{error || 'Failed to load analytics'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-8 rounded-3xl border-2 border-cyan-200 shadow-2xl hover-lift">
        <div className="flex items-start justify-between gap-8 flex-wrap lg:flex-nowrap">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Analytics</h1>
              <p className="text-gray-600">Detailed insights and performance metrics</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide w-28">Short Code:</span>
                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-mono font-bold rounded-xl shadow-lg">
                  {data.shortCode}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide w-28 mt-2">Original URL:</span>
                <a
                  href={data.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:text-blue-700 font-medium hover:underline inline-flex items-center gap-2 break-all"
                >
                  {data.originalUrl}
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide w-28">Short URL:</span>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={data.shortUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white/70 border-2 border-cyan-200 rounded-xl text-sm font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                      copied
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-white/70 hover:bg-white border-2 border-cyan-200 text-gray-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide w-28">Created:</span>
                <span className="text-sm text-gray-700 font-medium">
                  {formatDate(data.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="p-6 bg-white rounded-3xl shadow-xl">
              <img
                src={data.qrImage}
                alt="QR Code"
                className="w-48 h-48 rounded-2xl"
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl border-2 border-blue-200 shadow-xl hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Total Scans</div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {data.scanCount}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-2 border-teal-200 shadow-xl hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Unique Days</div>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📅</span>
            </div>
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {data.timeline.length}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-2 border-blue-200 shadow-xl hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Avg Scans/Day</div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
            {data.timeline.length > 0
              ? (data.scanCount / data.timeline.length).toFixed(1)
              : '0'}
          </div>
        </div>
      </div>

      {/* Chart */}
      {data.timeline.length > 0 && (
        <div className="glass p-8 rounded-3xl border-2 border-cyan-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Scans Over Time</h2>
              <p className="text-sm text-gray-600">Track your QR code performance</p>
            </div>
          </div>
          <div className="bg-white/50 p-4 rounded-2xl">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Scans */}
      <div className="glass p-8 rounded-3xl border-2 border-teal-200 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🔍</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Scans</h2>
            <p className="text-sm text-gray-600">Latest scan activity</p>
          </div>
        </div>
        {data.recentScans.length > 0 ? (
          <div className="space-y-3">
            {data.recentScans.map((scan, index) => (
              <div
                key={index}
                className="p-5 bg-gradient-to-br from-white/70 to-cyan-50/70 backdrop-blur-sm rounded-2xl border-2 border-cyan-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(scan.timestamp)}
                    </div>
                  </div>
                  {scan.ipAddress && (
                    <div className="px-3 py-1 bg-cyan-100 text-cyan-700 font-mono text-xs rounded-lg font-semibold">
                      {scan.ipAddress}
                    </div>
                  )}
                </div>
                {scan.userAgent && (
                  <div className="text-xs text-gray-600 mt-2 p-2 bg-white/50 rounded-lg truncate font-mono">
                    {scan.userAgent}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <span className="text-3xl">👀</span>
            </div>
            <p className="text-gray-600 font-medium">No scans yet</p>
            <p className="text-sm text-gray-500 mt-1">Share your QR code to start tracking!</p>
          </div>
        )}
      </div>
    </div>
  );
}
