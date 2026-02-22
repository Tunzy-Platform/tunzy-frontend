
export const  DownloadStatusEnum ={
  Pending : 'pending',
  Downloading : 'downloading',
  Failed : 'failed',
  Successful : 'successful',
}
export type DownloadStatusType = typeof DownloadStatusEnum[keyof typeof DownloadStatusEnum]

export type DownloadTrack = {
    id:number
    status:DownloadStatusType
    track:PlaylistTrackType
    progress:number
}
export type DownloadTrackData = {
    id:number
    file_path:string|null
    status:DownloadStatusType
}
export type DownloadProgressType = {
    percent:number
    status:DownloadStatusType
    track_id:number
}

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
    download:DownloadTrackData|null
    stream_url:URL
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