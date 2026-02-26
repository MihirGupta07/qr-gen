'use client';

import Analytics from '@/components/Analytics';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AnalyticsPageClient({ qrId }: { qrId: string }) {
  return (
    <main className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Decorative elements - Summer Vibes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 glass rounded-2xl text-cyan-900 hover:shadow-lg font-semibold mb-8 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <Analytics qrId={qrId} />
      </div>
    </main>
  );
}
