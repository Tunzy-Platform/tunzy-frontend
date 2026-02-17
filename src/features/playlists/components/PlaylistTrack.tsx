import { ItemGroup } from "@/components/ui/item";

import { PlaylistTrackItem } from "./PlaylistTrackItem";
import type { PlaylistTrackType } from "../../../types/types";
import { useContext, useEffect } from "react";
import { PlayerContext } from "@/features/player/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { DownloadStatusEnum } from "@/features/downloads/types";
import { useRetryDownloadTrack } from "@/features/downloads/hooks";

export function PlaylistTrack({
  tracks,
  playlistID,
}: {
  tracks: Array<PlaylistTrackType>;
  playlistID: number;
}) {
  const playerContext = useContext(PlayerContext);
  const queryClient = useQueryClient();
  useEffect(() => {
    const url = `http://127.0.0.1:8000/downloads/progress-report/${playlistID}/playlist`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      queryClient.setQueryData(
        ["playlist-tracks", playlistID],
        (cache: PlaylistTrackType[]) => {
          const lookup_map = new Map(cache.map((item) => [item.id, item]));
          for (const [trackID, statusData] of Object.entries(data)) {
            const trackIDNumber = Number(trackID);
            const track = lookup_map.get(trackIDNumber);
            if (!track) continue;

            if (!track.download) {
              track.download = {
                id: -1,
                file_path: null,
                status: DownloadStatusEnum.Pending,
              };
            }

            lookup_map.set(trackIDNumber, {
              ...track,
              download: {
                ...track.download,
                status: statusData.status,
              },
            });
          }

          return Array.from(lookup_map.values());
        },
      );
    };

    return () => eventSource.close();
  }, []);

  const playTrackState = (track: PlaylistTrackType) => {
    if (!playTrackState) {
      return;
    }
    return playerContext?.setTrack(track);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup className="gap-2">
        {tracks.map((song) => (
          <PlaylistTrackItem
            key={song.id}
            song={song}
            playlistID={playlistID}
            onPlaySong={playTrackState}
          />
        ))}
      </ItemGroup>
    </div>
  );
}
