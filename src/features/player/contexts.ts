
import { createContext, useState } from "react";
import type { PlaylistTrackType } from "@/types/types";

export type PlayerContextType = {
  track: PlaylistTrackType|null ;
  setTrack:CallableFunction
};

export const usePlayerContext = (track:PlaylistTrackType|null):PlayerContextType=>{
  const [_track,_setTrack] = useState(track)
  return {
    track:_track,
    setTrack:_setTrack
  }
}
export const PlayerContext = createContext<PlayerContextType | null>(null);
