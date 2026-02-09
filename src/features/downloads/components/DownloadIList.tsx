import { useFetchDownloads } from "../hooks";
import { DownloadListItem } from "./DownloadLitstItem";
import { EmptyList } from "./EmptyList";

export function DownloadsList() {
  const { data, isLoading, error } = useFetchDownloads();
  if (isLoading) {
    return <>loading downloads ...</>;
  }

  if (!data || !data.length || error) {
    return <EmptyList />;
  }
  return (
    <div className="flex flex-col justify-center gap-4 w-full">
      {data.map((item) => {
        return <DownloadListItem key={item.id} song={item.track} />;
      })}
    </div>
  );
}
