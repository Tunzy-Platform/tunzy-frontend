import { ItemGroup } from "@/components/ui/item";
import { usePlaylists } from "../hooks";

import { PlaylistListItem } from "./PlaylistListItem";
export function PlaylistList() {
  const { data, isLoading, error } = usePlaylists();
  if (isLoading) {
    return <>is loading ....</>;
  }
  if (error) {
    return <>Error on fetching playlists. Try Again</>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup className="gap-2">
        {data.map((playlist) => (
          <PlaylistListItem playlist={playlist} />
        ))}
      </ItemGroup>
    </div>
  );
}
