import { ItemGroup } from "@/components/ui/item";

import { PlaylistTrackItem } from "./PlaylistTrackItem";
import type { PlaylistTrackType } from "../../../types/types";

export function PlaylistTrack({
  tracks,
  playlistID,
}: {
  tracks: Array<PlaylistTrackType>;
  playlistID: number;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup className="gap-2">
        {tracks.map((song) => (
          <PlaylistTrackItem
            key={song.id}
            song={song}
            playlistID={playlistID}
          />
        ))}
      </ItemGroup>
    </div>
  );
}
