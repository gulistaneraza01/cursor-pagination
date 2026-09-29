"use client";

import { useEffect, useRef } from "react";
import { useInfiniteUsers } from "@/hooks/useInfiniteUsers";
import { Skeleton } from "@/components/ui/skeleton";

export function UserList() {
  const { users, isLoading, hasMore, error, fetchNextPage } = useInfiniteUsers();
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  useEffect(() => {
    const root = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPageRef.current();
        }
      },
      { root, rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [users.length, hasMore]);

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cursor Pagination</h1>
          <p className="mt-1 text-sm text-muted-foreground">{users.length} users loaded</p>
        </div>

        <div
          ref={containerRef}
          className="h-[70vh] overflow-y-auto rounded-xl border border-border"
        >
          <ul className="divide-y divide-border">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(user.create_at).toLocaleDateString()}
                </span>
              </li>
            ))}

            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-4">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </li>
              ))}
          </ul>

          <div ref={sentinelRef} className="h-1" />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {!hasMore && !isLoading && users.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">You&apos;ve reached the end.</p>
        )}
      </div>
    </div>
  );
}
