import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import type { PlaylistTrackType } from "@/types/types";
import { DownloadStatusEnum } from "../types";

export function DownloadListItem({
  song,
  cancelFn,
  retryFn,
}: {
  song: PlaylistTrackType;
  cancelFn: CallableFunction;
  retryFn: CallableFunction;
}) {
  return (
    <Item key={song.id} variant="outline" asChild role="listitem">
      <a href="#">
        <ItemMedia variant="image" className="w-20 h-20">
          <img
            src={song.thumbnail || undefined}
            alt={song.name}
            className="object-cover  "
          />
        </ItemMedia>
        <ItemContent className="">
          <ItemTitle className="line-clamp-1">
            {song.name} {song.album && "- "}
            <span className="text-muted-foreground">{song.album}</span>
          </ItemTitle>
          <ItemDescription>{song.artist_name}</ItemDescription>

          <Field className="w-full ">
            <div className="flex w-full gap-5 items-center ">
              <Progress value={66} id="progress-upload" className="flex-1" />
              <span className="ml-auto">66%</span>
            </div>
          </Field>
        </ItemContent>
        {song.download?.status == DownloadStatusEnum.Failed && (
          <ItemActions>
            <Button variant="outline" onClick={() => retryFn()}>
              Retry
            </Button>
          </ItemActions>
        )}
        {song.download?.status != DownloadStatusEnum.Successful && (
          <ItemActions>
            <Button variant="outline" onClick={() => cancelFn()}>
              Cancel
            </Button>
          </ItemActions>
        )}
      </a>
    </Item>
  );
}
