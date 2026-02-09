import { useFetchDownloads } from "../hooks";
import { DownloadListItem } from "./DownloadLitstItem";
import { EmptyList } from "./EmptyList";

export function DownloadsList() {
  const downloads = useFetchDownloads();
  if (!downloads || !downloads.length) {
    return <EmptyList />;
  }
  return (
    <div className="flex flex-col justify-center gap-4 w-full">
      {downloads.map((item) => {
        return <DownloadListItem song={item.track} />;
      })}
    </div>
  );
}
