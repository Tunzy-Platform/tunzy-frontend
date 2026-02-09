import type { PlaylistTrackType } from "@/types/types"

export const  DownloadStatusEnum ={
  Pending : 'pending',
  Downloading : 'downloading',
  Error : 'error',
  Successful : 'successful',
}
export type DownloadStatusType = typeof DownloadStatusEnum[keyof typeof DownloadStatusEnum]

export type DownloadTrackType = {
    id:number
    status:DownloadStatusType
    track:PlaylistTrackType
}