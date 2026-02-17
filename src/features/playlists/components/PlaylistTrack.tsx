import { ItemGroup } from "@/components/ui/item";

import { PlaylistTrackItem } from "./PlaylistTrackItem";
import type { PlaylistTrackType } from "../../../types/types";
import { useContext } from "react";
import { PlayerContext } from "@/features/player/contexts";

export function PlaylistTrack({
  tracks,
  playlistID,
}: {
  tracks: Array<PlaylistTrackType>;
  playlistID: number;
}) {
  const playerContext = useContext(PlayerContext);
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
