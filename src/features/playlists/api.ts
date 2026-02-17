import { GET,POST } from "@/api/client";
import type {  PlaylistType, PlaylistTrackType, SyncPlaylistTracksType, SyncPlaylistsType } from "../../types/types";



export function fetchPlaylists():Promise<PlaylistType[]>{
    return GET("playlists/",{})
}
export function fetchPlaylist(id:number|undefined):Promise<PlaylistType>{
    return GET(`playlists/${id}/`,{})
}
export function fetchPlaylistTracks(playlistID:number|undefined):Promise<PlaylistTrackType[]>{
    return GET(`playlists/${playlistID}/tracks/`,{})
}
export function syncPlaylistTracks(playlistID:number|undefined):Promise<SyncPlaylistTracksType>{
    return POST(`playlists/${playlistID}/sync/`,{},{})
}
export function syncPlaylists():Promise<SyncPlaylistsType>{
    return POST(`playlists/sync/`,{},{})
}