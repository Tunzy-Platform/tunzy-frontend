import { Route, Routes } from "react-router-dom";
import { PlaylistTracksPage } from "./pages/PlaylistTracksPage";
import { PlayListsPage } from "./pages/PlayListsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SettingsGuard } from "./features/settings/components/SettingsGuard";
import { DownloadsPage } from "./pages/DownloadsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/settings" element={<SettingsPage />} />
      <Route element={<SettingsGuard />}>
        <Route path="" element={<PlayListsPage />} />
        <Route path="playlists" element={<PlayListsPage />} />
        <Route path="playlists/:playlistID" element={<PlaylistTracksPage />} />
        <Route path="downloads/" element={<DownloadsPage />} />
      </Route>
    </Routes>
  );
}
