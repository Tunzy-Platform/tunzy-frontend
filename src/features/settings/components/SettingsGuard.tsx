import { Navigate, Outlet } from "react-router-dom";
import { useFetchSettings } from "../hooks";
import { isSettingComplete } from "../utils";


export function SettingsGuard() {
  const { data, isError } = useFetchSettings();


  if (!data || !isSettingComplete(data) || isError) {
    return <Navigate to="settings/" replace />;
  }
  return <Outlet />;
}
