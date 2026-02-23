import type { PlaylistTrackType } from "@/types/types"


export const RepeatModes = ["off" ,"all", "one" ] as const
export interface PlayerStore {
  queue:PlaylistTrackType[]
  playback:number[]
  playlistID:number|null
  trackIndex:number|null
  isPlaying:boolean
  isShuffle:boolean
  repeatMode: "off" | "all" |  "one" 
  currentIndex:number|null
}
export type PlayerAction =  (
  {type:"PlayingTrack",trackID:number,playlistID:number,queue:PlaylistTrackType[]}|
  {type:"BuildPlayback",shuffle:boolean}|
  {type:"StartPlaying"}|
  {type:"PausePlaying"}|
  {type:"NextTrack"}|
  {type:"PreviousTrack"} |
  {type:"RefreshQueue",queue:PlaylistTrackType[]} |
  {type:"ToggleShuffle"} |
  {type:"ToggleRepeatMode"} 
  
)

export type PlayerContextValue = {
  playerDispatch:CallableFunction
  state:PlayerStore
}