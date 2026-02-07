import { Button } from "@/components/ui/button";
import { PlaylistList } from "../features/playlists/components/PlaylistList";
import { Spinner } from "@/components/ui/spinner";
import { useSyncPlaylists } from "@/features/playlists/hooks";
import { useEffect } from "react";
import { toast } from "sonner";

export function PlayListsPage() {
  const {
    syncing,
    syncingData,
    syncingIsLoading,
    syncingError,
    syncingSuccess,
  } = useSyncPlaylists();

  useEffect(() => {
    if (syncingData && syncingSuccess) {
      toast.success(`${syncingData.total} Playlists Updated`, {
        position: "top-right",
      });
    }
  },[syncingData , syncingSuccess]);

  useEffect(() => {
    if ( syncingError) {
      toast.error(`Error While Syncing Playlists Try Again`, {
        position: "top-right",
      });
    }
  },[syncingError]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl pt-10 gap-3 flex flex-col">
        <div className="self-end">
          <Button
            variant="secondary"
            disabled={syncingIsLoading}
            onClick={() => syncing()}
          >
            Syncing
            {syncingIsLoading && <Spinner data-icon="inline-start" />}
          </Button>
        </div>
        <div>
          <PlaylistList />
        </div>
      </div>
    </div>
  );
}
