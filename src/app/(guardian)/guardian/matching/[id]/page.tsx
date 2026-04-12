export default async function MatchingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">매칭 결과</h1>
      <p className="mt-2 text-muted">매칭 ID: {id}</p>
    </div>
  );
}
