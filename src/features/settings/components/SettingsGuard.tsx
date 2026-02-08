import { Navigate, Outlet } from "react-router-dom";
import { useFetchSettings } from "../hooks";
import { isSettingComplete } from "../utils";

export function SettingsGuard() {
  const { data, isLoading, error } = useFetchSettings();

  if (isLoading) {
    return <>loading settings ....</>;
  }
  if (isLoading) {
    return <>loading settings ...</>;
  }
  if (!data || !isSettingComplete(data) || error) {
    return <Navigate to="settings/" replace />;
  }
  return <Outlet />;
}
