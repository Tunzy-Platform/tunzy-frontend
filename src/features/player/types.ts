import type { PlaylistTrackType } from "@/types/types"

export interface PlayerStore {
  trackIndex:number
  queue:PlaylistTrackType[]
  playback:number[]
  playlistID:number|null
  isPlaying:boolean
  isShuffle:boolean
  currentIndex:number|null
}
export type PlayerAction =  (
  {type:"PlayingTrack",trackID:number,playlistID:number,queue:PlaylistTrackType[]}|
  {type:"BuildPlayback"}|
  {type:"StartPlaying"}|
  {type:"NextTrack"}|
  {type:"PreviousTrack"} 
)

export type PlayerContextValue = {
  playerDispatch:CallableFunction
  state:PlayerStore
}