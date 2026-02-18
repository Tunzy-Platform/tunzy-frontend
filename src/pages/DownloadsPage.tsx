import { DownloadsList } from "@/features/downloads/components/DownloadIList";

export function DownloadsPage() {
  return (
    <div className="flex justify-center">
      <div className="max-w-6xl w-full flex justify-center mb-10">
        <DownloadsList />
      </div>
    </div>
  );
}
