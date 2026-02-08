import { PlaylistList } from "../features/playlists/components/PlaylistList";

export function PlayListsPage() {

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl pt-10 gap-3 flex flex-col">
        <div>
          <PlaylistList />
        </div>
      </div>
    </div>
  );
}
