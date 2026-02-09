import { GET, POST } from "@/api/client";
import type { DownloadTrackType } from "./types";

export function fetchDownloads():Promise<DownloadTrackType[]>{
    return GET("downloads/",{})
}
export function startDownloadTrack(trackID:number):Promise<DownloadTrackType>{
    return POST(`downloads/playlists/tracks/${trackID}`,{},{})
}