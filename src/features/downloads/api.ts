import { GET, POST } from "@/api/client";
import type { DownloadTrack, DownloadTrackData } from "@/types/types";

export function fetchDownloads():Promise<DownloadTrack[]>{
    return GET("downloads/",{})
}
export function startDownloadTrack(trackID:number):Promise<DownloadTrackData>{
    return POST(`downloads/playlists/tracks/${trackID}`,{},{})
}
export function cancelDownloadTrack(downloadID:number):Promise<DownloadTrackData>{
    return POST(`downloads/${downloadID}/cancel/`,{},{})
}
export function retryDownloadTrack(downloadID:number):Promise<DownloadTrackData>{
    return POST(`downloads/${downloadID}/retry`,{},{})
}