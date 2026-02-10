import { useCancelDownloadTrack, useFetchDownloads } from "../hooks";
import { DownloadListItem } from "./DownloadLitstItem";
import { EmptyList } from "./EmptyList";

export function DownloadsList() {
  const { data, isLoading, error } = useFetchDownloads();
  const { mutate } = useCancelDownloadTrack();

  if (!data || !data.length || error || isLoading) {
    return <EmptyList />;
  }
  return (
    <div className="flex flex-col justify-center gap-4 w-full">
      {data.map((item) => {
        return (
          <DownloadListItem
            key={item.id}
            song={item.track}
            cancelFn={() => mutate(item.id)}
            retryFn={() => mutate(item.id)}
          />
        );
      })}
    </div>
  );
}
