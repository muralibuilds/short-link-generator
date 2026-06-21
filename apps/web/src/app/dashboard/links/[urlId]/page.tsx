import { redirect } from "next/navigation";

export default async function LinkAnalyticsRedirect({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  redirect(`/?link=${encodeURIComponent(urlId)}`);
}
