'use client';

import { useState } from 'react';
import { Download, Copy, Check, Loader2, Sparkles, Link2 } from 'lucide-react';

interface QRGeneratorProps {
  onGenerated?: () => void;
}

export default function QRGenerator({ onGenerated }: QRGeneratorProps) {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedQR, setGeneratedQR] = useState<{
    qrImage: string;
    shortUrl: string;
    id: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate QR code');
      }

      setGeneratedQR({
        qrImage: result.data.qrImage,
        shortUrl: result.data.shortUrl,
        id: result.data.id,
      });

      if (onGenerated) {
        onGenerated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedQR) {
      await navigator.clipboard.writeText(generatedQR.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR.qrImage;
    link.download = `qr-code-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Your QR Code</h2>
          <p className="text-sm text-gray-600">Enter any URL or text to get started</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-cyan-600" />
              URL or Text
            </div>
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com or any text"
            className="w-full px-5 py-4 bg-white/50 border-2 border-cyan-200 rounded-2xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Output Format
          </label>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              format === 'png' 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-500 text-white shadow-lg' 
                : 'bg-white/50 border-gray-200 text-gray-700 hover:border-cyan-300'
            }`}>
              <input
                type="radio"
                value="png"
                checked={format === 'png'}
                onChange={(e) => setFormat(e.target.value as 'png')}
                className="hidden"
              />
              <span className="font-semibold">PNG</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              format === 'svg' 
                ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-500 text-white shadow-lg' 
                : 'bg-white/50 border-gray-200 text-gray-700 hover:border-cyan-300'
            }`}>
              <input
                type="radio"
                value="svg"
                checked={format === 'svg'}
                onChange={(e) => setFormat(e.target.value as 'svg')}
                className="hidden"
              />
              <span className="font-semibold">SVG</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
            <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">!</span>
            </div>
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 transition-all duration-200 shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating Magic...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate QR Code
            </>
          )}
        </button>
      </form>

      {generatedQR && (
        <div className="mt-10 p-8 bg-gradient-to-br from-white/80 to-cyan-50/80 backdrop-blur-sm border-2 border-cyan-200 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-bold text-gray-900">Your QR Code is Ready!</h3>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="p-6 bg-white rounded-3xl shadow-xl">
              {format === 'png' ? (
                <img
                  src={generatedQR.qrImage}
                  alt="Generated QR Code"
                  className="w-64 h-64 rounded-2xl"
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: generatedQR.qrImage }}
                  className="w-64 h-64 rounded-2xl"
                />
              )}
            </div>

            <div className="w-full space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={generatedQR.shortUrl}
                  readOnly
                  className="flex-1 px-5 py-3 bg-white/70 border-2 border-cyan-200 rounded-2xl text-sm font-mono"
                />
                <button
                  onClick={handleCopy}
                    className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                    copied
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-white/70 hover:bg-white border-2 border-cyan-200 text-gray-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
