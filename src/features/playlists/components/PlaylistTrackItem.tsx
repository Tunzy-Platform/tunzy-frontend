import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { PlaylistTrackType } from "../../../types/types";
import { convertDurationToTime } from "../../../utils";

export function PlaylistTrackItem({ song }: { song: PlaylistTrackType }) {
  return (
    <Item key={song.id} variant="outline" asChild role="listitem">
      <a href="#">
        <ItemMedia variant="image" className="w-1/12 h-1/6">
          <img
            src={song.thumbnail || ""}
            alt={song.name}
            className="object-cover  "
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            {song.name} -{" "}
            <span className="text-muted-foreground">{song.album}</span>
          </ItemTitle>
          <ItemDescription>{song.artist_name}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>
            {convertDurationToTime(song.duration)}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          {song.is_synced ? "✅" : "☑️"}
        </ItemContent>
      </a>
    </Item>
  );
}
