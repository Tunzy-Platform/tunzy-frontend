import { useEffect } from "react";
import { useCancelDownloadTrack, useFetchDownloads } from "../hooks";
import { DownloadListItem } from "./DownloadLitstItem";
import { EmptyList } from "./EmptyList";
import { useQueryClient } from "@tanstack/react-query";
import type { DownloadTrack } from "../types";

export function DownloadsList() {
  const { data, isLoading, error } = useFetchDownloads();
  const { mutate } = useCancelDownloadTrack();
  const queryClient = useQueryClient();

  const API_BASE_UEL = "http://127.0.0.1:8000/downloads/progress-reports/";
  useEffect(() => {
    const eventSource = new EventSource(API_BASE_UEL, {});
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      queryClient.setQueryData<DownloadTrack[]>(["downloads"], (downloads) => {
        if (!downloads) return;

        const map = new Map(downloads.map((item) => [item.id, item]));
        for (const [id, status] of Object.entries(data)) {
          const itemId = Number(id);
          const item = map.get(itemId);
          if (!item) continue;
          map.set(itemId, {
            ...item,
            progress: Number(status.percent),
            status: status.status,
          });
        }
        return Array.from(map.values());
      });
    };
    return () => {
      eventSource.close();
    };
  }, []);

  if (!data || !data.length || error || isLoading) {
    return <EmptyList />;
  }
  return (
    <div className="flex flex-col justify-center gap-4 w-full">
      {data.map((item) => {
        return (
          <DownloadListItem
            key={item.id}
            item={item}
            cancelFn={() => mutate(item.id)}
            retryFn={() => mutate(item.id)}
          />
        );
      })}
    </div>
  );
}
