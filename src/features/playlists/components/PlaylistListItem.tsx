import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Link } from "react-router-dom";
import type { PlaylistType } from "../../../types/types";
import { convertDurationToTime } from "../../../utils";
import { InfinityIcon } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export function PlaylistListItem({
  playlist,
}: {
  playlist: PlaylistType | undefined | null;
}) {
  const [imgIsLoaded, setImageIsLoaded] = useState(false);
  return (
    <Item key={playlist?.id} variant="outline" asChild role="listitem">
      <Link to={`/playlists/${playlist?.id}`}>
        <ItemMedia variant="image" className="size-15 md:size-18">
          {!imgIsLoaded && (
            <Skeleton className="size-18 shrink-0  object-cover " />
          )}
          <img
            src={playlist?.thumbnail}
            alt={playlist?.name}
            className="object-cover  "
            onLoad={() => setImageIsLoaded(true)}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1 text-wrap">
            {playlist?.name}
          </ItemTitle>
          <ItemDescription>{playlist?.owner}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center  hidden md:inline ">
          <ItemDescription>{playlist?.track_count} items</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center hidden md:inline">
          <ItemDescription>
            {playlist?.duration ? (
              convertDurationToTime(playlist?.duration)
            ) : (
              <InfinityIcon />
            )}
          </ItemDescription>
        </ItemContent>
        {/* <ItemContent className="flex-none text-center">
          status: {playlist?.is_synced ? "✅" : "☑️"}
        </ItemContent> */}
      </Link>
    </Item>
  );
}
