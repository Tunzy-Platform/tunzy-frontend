export type PlaylistType = {
    id:number
    url:string
    name:string
    track_count:number
    owner:string
    duration:number
    thumbnail:string
    is_synced:boolean
}
export type PlaylistTrackType = {
    id:number
    url:string
    name:string
    artist_name:string
    album:string|null
    duration:number
    is_synced:boolean
    thumbnail:string|null
}
export type SyncPlaylistTracksType = {
    updated_tracks:number
    changed_tracks:number
    unchanged_tracks:number
    total:number
}
export type SyncPlaylistsType = {
updated_playlists:number
created_playlists:number
total:number
}