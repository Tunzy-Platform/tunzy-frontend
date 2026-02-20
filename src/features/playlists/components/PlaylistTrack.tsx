import { ItemGroup } from "@/components/ui/item";

import { PlaylistTrackItem } from "./PlaylistTrackItem";
import type {
  DownloadProgressType,
  PlaylistTrackType,
} from "../../../types/types";
import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { DownloadStatusEnum } from "@/features/downloads/types";
import { usePlayer } from "@/features/player/hooks";

export function PlaylistTrack({
  tracks,
  playlistID,
  syncingDone,
}: {
  tracks: PlaylistTrackType[] | null | undefined;
  playlistID: number | undefined;
  syncingDone: boolean;
}) {
  const player = usePlayer();
  const queryClient = useQueryClient();
  useEffect(
    () => {
      const url = `${import.meta.env.VITE_REACT_APP_BASE_URL_API}/downloads/progress-report/${playlistID}/playlist`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (ev) => {
        const data: DownloadProgressType[] = JSON.parse(ev.data);
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
    },
    // this api didn't update itself tracks list
    // so after tracks be updated we call it again
    [playlistID, queryClient, syncingDone],
  );

  const playingTrack = (track: PlaylistTrackType) => {
    return player.playerDispatch({
      type: "PlayingTrack",
      playlistID: playlistID || 0,
      trackID: track.id,
      queue: tracks,
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup className="gap-2">
        {tracks?.map((song) => (
          <PlaylistTrackItem
            key={song.id}
            song={song}
            playlistID={playlistID}
            onPlaySong={playingTrack}
          />
        ))}
      </ItemGroup>
    </div>
  );
}
