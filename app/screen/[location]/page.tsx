import { notFound } from 'next/navigation';
import MenuBoard from '@/components/MenuBoard';
import { getLocationConfig } from '@/config/screens';
import { fetchMenu } from '@/lib/syrve';

export const dynamic = 'force-dynamic';

export default async function ScreenPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const config = getLocationConfig(location);
  if (!config) notFound();

  const menu = await fetchMenu(location);
  return <MenuBoard initialMenu={menu} config={config} />;
}
