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


export function PlaylistTrackItem({
  playlistID,
  song,
}: {
  playlistID: number;
  song: PlaylistTrackType;
}) {
  const { mutate: downloadMutation, isPending } =
    useStartDownloadTrack(playlistID);

  return (
    <Item variant="outline" asChild role="listitem">
      <div>
        <ItemMedia variant="image" className="w-1/12 h-1/6">
          <img
            src={song.thumbnail || undefined}
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
                  setState={() => null}
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
