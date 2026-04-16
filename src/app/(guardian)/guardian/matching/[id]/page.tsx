import { MatchingView } from '@/components/matching/MatchingView';

export default async function MatchingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="py-6 sm:py-8">
      <MatchingView careRequestId={id} />
    </div>
  );
}
