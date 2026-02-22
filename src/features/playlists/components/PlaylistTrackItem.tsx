import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { DownloadStatusEnum, type PlaylistTrackType } from "@/types/types";
import { convertDurationToTime } from "@/utils";
import {
  useRetryDownloadTrack,
  useStartDownloadTrack,
} from "@/features/downloads/hooks";
import { CloudAlertIcon, CloudDownloadIcon, PlayIcon } from "lucide-react";
import { ImageSpinnerButton } from "@/components/ImageSpinnerButton";
import { Progress } from "@/components/ui/progress";

export function PlaylistTrackItem({
  playlistID,
  song,
  onPlaySong,
}: {
  playlistID: number | undefined;
  song: PlaylistTrackType;
  onPlaySong: CallableFunction;
}) {
  const { mutate: downloadMutation, isPending } =
    useStartDownloadTrack(playlistID);

  const {
    mutate: retryMutate,
    isPending: retryIsPending,
    isSuccess,
  } = useRetryDownloadTrack();

  return (
    <Item variant="outline" asChild role="listitem">
      <div className="">
        <div className="flex w-full h-full gap-2 content-center items-around">
          {/* Thumbnail + Action */}
          <ItemMedia variant="image" className="size-16 md:size-16 ">
            {song.download == null && (
              <ImageSpinnerButton
                src={song.thumbnail || ""}
                alt={song.name}
                setState={() => downloadMutation(song.id)}
                disabled={isPending}
                isLoading={isPending}
                className="w-16 h-16"
              >
                {/* Icon */}
                <CloudDownloadIcon className="relative z-10 text-white" />
              </ImageSpinnerButton>
            )}
            {/* Successful State */}
            {song.download &&
              song.download.status == DownloadStatusEnum.Successful && (
                <ImageSpinnerButton
                  src={song.thumbnail || ""}
                  alt={song.name}
                  setState={() => onPlaySong(song)}
                  disabled={isPending}
                  isLoading={isPending}
                  className="w-16 h-16"
                >
                  {/* Icon */}
                  <PlayIcon className="relative z-10 text-white" />
                </ImageSpinnerButton>
              )}
            {/* Pending State */}
            {song.download &&
              song.download.status == DownloadStatusEnum.Pending && (
                <ImageSpinnerButton
                  src={song.thumbnail || ""}
                  alt={song.name}
                  setState={() => null}
                  disabled={isPending}
                  isLoading={true}
                  className="w-16 h-16"
                  children={undefined}
                />
              )}
            {/* Downloading State */}
            {song.download &&
              song.download.status == DownloadStatusEnum.Downloading && (
                <ImageSpinnerButton
                  src={song.thumbnail || ""}
                  alt={song.name}
                  setState={() => null}
                  disabled={isPending}
                  isLoading={true}
                  className="w-16 h-16"
                  children={undefined}
                />
              )}
            {/* Failed State */}
            {song.download &&
              song.download.status == DownloadStatusEnum.Failed && (
                <ImageSpinnerButton
                  src={song.thumbnail || ""}
                  alt={song.name}
                  setState={() => {
                    if (song?.download) retryMutate(song.download.id);
                  }}
                  disabled={retryIsPending || isSuccess}
                  isLoading={retryIsPending || isSuccess}
                  className="w-16 h-16"
                >
                  {/* Icon */}
                  <CloudAlertIcon className="relative z-10 text-white" />
                </ImageSpinnerButton>
              )}
          </ItemMedia>
          {/* Title */}
          <ItemContent className="h-full mt-2 ml-2">
            <ItemTitle className="line-clamp-1">
              {song.name}
              {song.album && (
                <span className="text-muted-foreground">- {song.album}</span>
              )}
            </ItemTitle>
            <ItemDescription>{song.artist_name || ""}</ItemDescription>
          </ItemContent>
          {/* Duration */}
          <ItemContent className="flex-none text-center">
            <ItemDescription>
              {convertDurationToTime(song.duration)}
            </ItemDescription>
          </ItemContent>
        </div>

        {/* Download Progress */}
        {song.download &&
          (song.download.status == DownloadStatusEnum.Downloading ||
            song.download.status == DownloadStatusEnum.Pending) && (
            <div className="flex w-full gap-2 items-center h-1 text-center">
              <Progress
                value={song.download.progress || 0}
                id="progress-upload"
                className="flex-1 h-1"
              />
              <span className="ml-auto text-xs">
                {song.download.progress || 0}%
              </span>
            </div>
          )}
      </div>
    </Item>
  );
}
