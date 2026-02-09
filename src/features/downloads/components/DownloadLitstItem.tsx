import { Field } from "@/components/ui/field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import type { PlaylistTrackType } from "@/types/types";

export function DownloadListItem({ song }: { song: PlaylistTrackType }) {
  return (
    <Item key={song.id} variant="outline" asChild role="listitem">
      <a href="#">
        <ItemMedia variant="image" className="w-20 h-20">
          <img
            src={song.thumbnail || ""}
            alt={song.name}
            className="object-cover  "
          />
        </ItemMedia>
        <ItemContent className="">
          <ItemTitle className="line-clamp-1">
            {song.name} -{" "}
            <span className="text-muted-foreground">{song.album}</span>
          </ItemTitle>
          <ItemDescription>{song.artist_name}</ItemDescription>
          <ItemDescription className="w-full">
            <Field className="w-full ">
              <div className="flex w-full gap-5 items-center ">
                <Progress value={66} id="progress-upload" className="flex-1" />
                <span className="ml-auto">66%</span>
              </div>
            </Field>
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  );
}
