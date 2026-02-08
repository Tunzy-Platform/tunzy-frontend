import { GET, PATCH } from "@/api/client";
import type { SettingsType } from "./types";

export function updateSetting(data:SettingsType):Promise<SettingsType>{
    return PATCH("settings/",data,{})
}
export function fetchSettings():Promise<SettingsType>{
    return GET("settings/",{})
}