import { PlaylistListItem } from "@/features/playlists/components/PlaylistListItem";
import {
  usePlaylist,
  usePlaylistTracks,
  useSyncPlaylistTracks,
} from "@/features/playlists/hooks";
import { PlaylistTrack } from "../features/playlists/components/PlaylistTrack";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import { useEffect } from "react";
import { SpinnerButton } from "@/components/SpinnerButton";
import { EmptyList } from "@/features/playlists/components/EmptyList";
export function PlaylistTracksPage() {
  const { playlistID } = useParams<{ playlistID: string }>();
  const {
    data: playlistData,
    isLoading: playlistIsLoading,
    error: playlistError,
  } = usePlaylist(playlistID);

  const { data, isLoading, error } = usePlaylistTracks(playlistData?.id);

  const {
    syncing,
    syncingData,
    syncingIsLoading,
    syncingError,
    syncingSuccess,
  } = useSyncPlaylistTracks(playlistData?.id);
  useEffect(() => {
    if (syncingError) {
      toast.error("Error While Syncing Tracks Try Again", {
        position: "top-right",
      });
    }
  }, [syncingError]);

  useEffect(() => {
    if (syncingSuccess && syncingData) {
      toast.success(`${syncingData.total} Tracks Updated Successfully`, {
        position: "top-right",
      });
    }
  }, [syncingData, syncingSuccess]);

  if (isLoading || playlistIsLoading) {
    return <>is loading ...</>;
  } else if (error || playlistError) {
    return <>Error</>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl pt-10 gap-3 flex flex-col">
        <div className="flex gap-2 self-end">
          <SpinnerButton
            text="Syncing"
            setState={syncing}
            disabled={syncingIsLoading}
            isLoading={syncingIsLoading}
          />
          <Button variant="secondary" disabled>
            Downloading
            <Spinner data-icon="inline-start" />
          </Button>
        </div>
        <div>
          <h1>Playlist:</h1>
          <PlaylistListItem playlist={playlistData} />
        </div>
        <div>
          <h1>Tracks:</h1>
          {!data?.length && (
            <EmptyList
              text="Syncing"
              setState={syncing}
              disabled={syncingIsLoading}
              isLoading={syncingIsLoading}
            />
          )}
          <PlaylistTrack tracks={data} playlistID={playlistData?.id} />
        </div>
      </div>
    </div>
  );
}
