import AnalyticsPageClient from './AnalyticsPageClient';

export default async function QRAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <AnalyticsPageClient qrId={id} />;
}
