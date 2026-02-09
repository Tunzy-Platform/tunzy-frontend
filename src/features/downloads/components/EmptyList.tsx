import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ListIcon } from "lucide-react";

export function EmptyList() {
  return (
    <Empty className="bg-muted/9 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListIcon />
        </EmptyMedia>
        <EmptyTitle>No Item</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {"Your list download is empty try to download some musics :)"}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
