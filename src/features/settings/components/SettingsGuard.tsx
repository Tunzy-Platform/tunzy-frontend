import { Navigate, Outlet } from "react-router-dom";
import { useFetchSettings } from "../hooks";
import { isSettingComplete } from "../utils";


export function SettingsGuard() {
  const { data, isError, isLoading } = useFetchSettings();


  if (!isLoading && (!data || !isSettingComplete(data) || isError)) {
    return <Navigate to="settings/" replace />;
  }
  return <Outlet />;
}
