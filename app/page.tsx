'use client';

import { useState } from 'react';
import QRGenerator from '@/components/QRGenerator';
import QRHistory from '@/components/QRHistory';
import { QrCode, Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQRGenerated = () => {
    // Trigger refresh of history list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Decorative elements - Summer Vibes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 glass rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-900">AI-Powered QR Analytics</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-sky-100 to-sky-300 leading-tight">
              Smart QR Code
              <br />
              Generator
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto drop-shadow-lg">
              Create beautiful QR codes and track every scan with powerful real-time analytics
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-800">Real-time Analytics</span>
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-800">Secure & Private</span>
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-medium text-gray-800">High Quality</span>
            </div>
          </div>
        </div>

        {/* Generator Section */}
        <div className="mb-12 glass rounded-3xl shadow-2xl p-8 md:p-12 hover-lift">
          <QRGenerator onGenerated={handleQRGenerated} />
        </div>

        {/* History Section */}
        <div className="glass rounded-3xl shadow-2xl p-8 md:p-12">
          <QRHistory refresh={refreshKey} />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">
              Built with Next.js, MongoDB & Recharts
            </p>
          </div>
          <p className="text-white/60 text-xs">
            Track every scan with detailed analytics • Export in PNG & SVG
          </p>
        </div>
      </div>
    </main>
  );
}
