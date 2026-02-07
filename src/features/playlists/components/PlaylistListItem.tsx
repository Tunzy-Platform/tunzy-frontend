import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Link } from "react-router-dom";
import type { PlaylistType } from "../types";
import { convertDurationToTime } from "../utils";
import { InfinityIcon } from "lucide-react";
export function PlaylistListItem({ playlist }: { playlist: PlaylistType }) {
  return (
    <Item key={playlist.id} variant="outline" asChild role="listitem">
      <Link to={`/playlists/${playlist.id}`}>
        <ItemMedia variant="image" className="w-1/12 h-1/6">
          <img
            src={playlist.thumbnail}
            alt={playlist.name}
            className="object-cover  "
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1 text-wrap">
            {playlist.name}
          </ItemTitle>
          <ItemDescription>{playlist.owner}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>{playlist.track_count} items</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>
            {playlist.duration ? (
              convertDurationToTime(playlist.duration)
            ) : (
              <InfinityIcon />
            )}
          </ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          status: {playlist.is_synced ? "✅" : "☑️"}
        </ItemContent>
      </Link>
    </Item>
  );
}
