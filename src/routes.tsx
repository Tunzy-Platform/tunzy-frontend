import { Route, Routes } from "react-router-dom";
import { PlaylistTracksPage } from "./pages/PlaylistTracksPage";
import { PlayListsPage } from "./pages/PlayListsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SettingsGuard } from "./features/settings/components/SettingsGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/settings" element={<SettingsPage />} />
      <Route element={<SettingsGuard />}>
        <Route path="playlists" element={<PlayListsPage />} />
        <Route path="" element={<PlayListsPage />} />
        <Route path="playlists/:playlistID" element={<PlaylistTracksPage />} />
      </Route>
    </Routes>
  );
}
