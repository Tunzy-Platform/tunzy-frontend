import { SpinnerButton } from "@/components/SpinnerButton";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ListIcon } from "lucide-react";

export function EmptyList({
  text,
  disabled,
  isLoading,
  setState,
}: {
  text: string;
  disabled: boolean;
  isLoading: boolean;
  setState: CallableFunction;
}) {
  return (
    <Empty className="bg-muted/9 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListIcon />
        </EmptyMedia>
        <EmptyTitle>No Item</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          Your list is empty try to syncing it
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <SpinnerButton
          text={text}
          setState={setState}
          disabled={disabled}
          isLoading={isLoading}
        />
      </EmptyContent>
    </Empty>
  );
}
