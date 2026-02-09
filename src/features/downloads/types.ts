import type { PlaylistTrackType } from "@/types/types"

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
}