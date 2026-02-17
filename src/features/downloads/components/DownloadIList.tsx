import { useEffect } from "react";
import {
  useCancelDownloadTrack,
  useFetchDownloads,
  useRetryDownloadTrack,
} from "../hooks";
import { DownloadListItem } from "./DownloadLitstItem";
import { EmptyList } from "./EmptyList";
import { useQueryClient } from "@tanstack/react-query";
import type { DownloadTrack } from "../types";
import type { DownloadProgressType } from "@/types/types";

export function DownloadsList() {
  const { data, isLoading, error } = useFetchDownloads();
  const { mutate: cancelMutate } = useCancelDownloadTrack();
  const { mutate: retryMutate } = useRetryDownloadTrack();
  const queryClient = useQueryClient();

  const API_BASE_UEL = `${process.env.REACT_APP_API_URL}/downloads/progress-reports/`;
  useEffect(() => {
    // TODO: add type for progress-reports
    const eventSource = new EventSource(API_BASE_UEL, {});
    eventSource.onmessage = (event) => {
      const data: DownloadProgressType[] = JSON.parse(event.data);
      // console.table(data);

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
            cancelFn={() => cancelMutate(item.id)}
            retryFn={() => retryMutate(item.id)}
          />
        );
      })}
    </div>
  );
}
