"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { shortenUrlSchema } from "@repo/shared";
import { CreateLinkBar, focusCreateLinkInput } from "./create-link-bar";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { LinkCardList } from "./link-card-list";
import { LinkDetailPanel } from "./link-detail-panel";
import { LinkDetailEmpty } from "./link-detail-empty";
import { DetailPanelSkeleton } from "@/components/ui/skeleton";
import { useDashboardLinks } from "@/hooks/use-dashboard-links";
import { useSelectedLink } from "@/hooks/use-selected-link";
import { useShortenUrl } from "@/hooks/use-shorten-url";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingUrl = searchParams?.get("url") ?? "";
  const { links, loading, error, addLink } = useDashboardLinks();
  const { selectedLink, selectLink } = useSelectedLink(links);
  const { shorten } = useShortenUrl();
  const pendingHandled = useRef(false);

  useEffect(() => {
    if (!pendingUrl || pendingHandled.current || loading) return;
    const parsed = shortenUrlSchema.safeParse({ origUrl: pendingUrl });
    if (!parsed.success) return;

    pendingHandled.current = true;
    void shorten(parsed.data.origUrl).then((link) => {
      addLink(link);
      selectLink(link.urlId);
      router.replace(`/?link=${encodeURIComponent(link.urlId)}`, {
        scroll: false,
      });
    });
  }, [pendingUrl, loading, shorten, addLink, selectLink, router]);

  function handleCreated(link: Parameters<typeof addLink>[0]) {
    addLink(link);
    selectLink(link.urlId);
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your links
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Create, manage, and analyze your short links.
        </p>
      </div>

      <CreateLinkBar onCreated={handleCreated} />

      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
            <LinkCardList
              links={[]}
              selectedUrlId={null}
              onSelect={() => {}}
              loading
            />
            <DetailPanelSkeleton />
          </div>
        ) : !links || links.length === 0 ? (
          <DashboardEmptyState onCreateClick={focusCreateLinkInput} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
            <LinkCardList
              links={links}
              selectedUrlId={selectedLink?.urlId ?? null}
              onSelect={selectLink}
            />
            {selectedLink ? (
              <LinkDetailPanel key={selectedLink.urlId} link={selectedLink} />
            ) : (
              <LinkDetailEmpty />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardShell() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-zinc-500">Loading dashboard…</div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
