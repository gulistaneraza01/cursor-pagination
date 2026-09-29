"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  create_at: string;
  modified_at: string;
}

interface UsersResponse {
  data: User[];
  nextCursor: string | null;
}

const PAGE_LIMIT = 20;

export function useInfiniteUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchNextPage = useCallback(async () => {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<UsersResponse>("/v1/users", {
        params: { limit: PAGE_LIMIT, ...(cursor ? { cursor } : {}) },
      });
      setUsers((prev) => [...prev, ...data.data]);
      setCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } catch {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [cursor, hasMore]);

  const hasFetchedFirstPage = useRef(false);
  useEffect(() => {
    if (hasFetchedFirstPage.current) return;
    hasFetchedFirstPage.current = true;
    fetchNextPage();
  }, [fetchNextPage]);

  return { users, isLoading, hasMore, error, fetchNextPage };
}
