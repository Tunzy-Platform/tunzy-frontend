import { ItemGroup } from "@/components/ui/item";
import { usePlaylists, useSyncPlaylists } from "../hooks";

import { PlaylistListItem } from "./PlaylistListItem";
import { SpinnerButton } from "@/components/SpinnerButton";
import { useEffect } from "react";
import { toast } from "sonner";
import { EmptyList } from "./EmptyList";

export function PlaylistList() {
  const { data, isLoading, error } = usePlaylists();
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
  }, [syncingData, syncingSuccess]);

  useEffect(() => {
    if (syncingError) {
      toast.error(`Error While Syncing Playlists Try Again`, {
        position: "top-right",
      });
    }
  }, [syncingError]);
  
  if (isLoading) {
    return <>is loading ....</>;
  }
  if (error) {
    return <>Error on fetching playlists. Try Again</>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="self-end">
        <SpinnerButton
          text="Syncing"
          setState={syncing}
          disabled={syncingIsLoading}
          isLoading={syncingIsLoading}
        />
      </div>

      <ItemGroup className="gap-2">
        {!data?.length && (
          <EmptyList
            text="Syncing"
            setState={syncing}
            disabled={syncingIsLoading}
            isLoading={syncingIsLoading}
          />
        )}
        {data.map((playlist) => (
          <PlaylistListItem playlist={playlist} />
        ))}
      </ItemGroup>
    </div>
  );
}
