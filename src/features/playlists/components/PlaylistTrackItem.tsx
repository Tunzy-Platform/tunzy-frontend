import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { PlaylistTrackType } from "../../../types/types";
import { convertDurationToTime } from "../../../utils";
import { SpinnerButton } from "@/components/SpinnerButton";
import { useStartDownloadTrack } from "@/features/downloads/hooks";
import { DownloadStatusEnum } from "@/features/downloads/types";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PlaylistTrackItem({
  playlistID,
  song,
  onPlaySong,
}: {
  playlistID: number;
  song: PlaylistTrackType;
  onPlaySong: CallableFunction;
}) {
  const { mutate: downloadMutation, isPending } =
    useStartDownloadTrack(playlistID);
  const [imgIsLoaded, setImgIsLoaded] = useState(false);

  return (
    <Item variant="outline" asChild role="listitem">
      <div>
        <ItemMedia variant="image" className="size-16">
          {!imgIsLoaded && <Skeleton className="size-16 shrink-0" />}
          {song.thumbnail && (
            <img
              src={song.thumbnail}
              alt={song.name}
              className="object-cover"
              onLoad={() => setImgIsLoaded(true)}
            />
          )}
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
        <ItemContent>
          <div className="flex gap-2 self-end">
            {song.download == null && (
              <SpinnerButton
                text="Download & Play"
                setState={() => downloadMutation(song.id)}
                disabled={isPending}
                isLoading={isPending}
              />
            )}
            {song.download &&
              song.download.status == DownloadStatusEnum.Successful && (
                <SpinnerButton
                  text="Play"
                  setState={() => onPlaySong(song)}
                  disabled={isPending}
                  isLoading={isPending}
                />
              )}
            {song.download &&
              song.download.status == DownloadStatusEnum.Pending && (
                <SpinnerButton
                  text="Downloading"
                  setState={() => null}
                  disabled={isPending}
                  isLoading={true}
                />
              )}
            {song.download &&
              song.download.status == DownloadStatusEnum.Downloading && (
                <SpinnerButton
                  text="Downloading"
                  setState={() => null}
                  disabled={isPending}
                  isLoading={true}
                />
              )}
          </div>
        </ItemContent>
      </div>
    </Item>
  );
}
