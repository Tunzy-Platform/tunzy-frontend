import type { SettingsType } from "./types";

export function isSettingComplete(settings:SettingsType):boolean{

    if (!settings){
        return false
    }
    else if(settings.soundcloud_oauth == ""){
        return false
    }
    return true
}