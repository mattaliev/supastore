type AnalyticsPageProps = {
  params: {
    storeId: string;
  };
};

export default function AnalyticsPage({
  params: { storeId }
}: AnalyticsPageProps) {
  return (
    <div>
      <h1>Analytics</h1>
    </div>
  );
}
