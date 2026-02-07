import { Route, Routes } from "react-router-dom";
import { PlaylistTracksPage } from "./pages/PlaylistTracksPage";
import { PlayListsPage } from "./pages/PlayListsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/playlists" element={<PlayListsPage />} />
      <Route path="" element={<PlayListsPage />} />
      <Route path="/playlists/:playlistID" element={<PlaylistTracksPage />} />
    </Routes>
  );
}
