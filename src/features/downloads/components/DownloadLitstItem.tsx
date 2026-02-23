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

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadStatusEnum, type DownloadTrack } from "@/types/types";

export function DownloadListItem({
  item,
  cancelFn,
  retryFn,
}: {
  item: DownloadTrack;
  cancelFn: CallableFunction;
  retryFn: CallableFunction;
}) {
    const [imgIsLoaded, setImgIsLoaded] = useState(false);
  
  return (
    <Item key={item.track.id} variant="outline" asChild role="listitem">
      <div>
        <ItemMedia variant="image" className="w-20 h-20">
          {!imgIsLoaded && <Skeleton className="size-16 shrink-0" />}
          {item.track.thumbnail && (
            <img
              src={item.track.thumbnail}
              alt={item.track.name}
              className="object-cover"
              onLoad={() => setImgIsLoaded(true)}
            />
          )}
        </ItemMedia>
        <ItemContent className="">
          <ItemTitle className="line-clamp-1">
            {item.track.name} {item.track.album && "- "}
            <span className="text-muted-foreground">{item.track.album}</span>
          </ItemTitle>
          <ItemDescription>{item.track.artist_name}</ItemDescription>
          {item.status == DownloadStatusEnum.Downloading && (
            <Field className="w-full ">
              <div className="flex w-full gap-5 items-center ">
                <Progress
                  value={item.progress || 0}
                  id="progress-upload"
                  className="flex-1"
                />
                <span className="ml-auto">{item.progress || 0}%</span>
              </div>
            </Field>
          )}
          {item.status == DownloadStatusEnum.Pending && (
            <Field className="w ">
              <Badge variant="secondary">
                Pending
                <Spinner data-icon="inline-end" />
              </Badge>
            </Field>
          )}
        </ItemContent>
        {item.status == DownloadStatusEnum.Failed && (
          <ItemActions>
            <Button variant="outline" onClick={() => retryFn()}>
              Retry
            </Button>
          </ItemActions>
        )}
        {item.status != DownloadStatusEnum.Successful && (
          <ItemActions>
            <Button variant="outline" onClick={() => cancelFn()}>
              Cancel
            </Button>
          </ItemActions>
        )}
      </div>
    </Item>
  );
}
