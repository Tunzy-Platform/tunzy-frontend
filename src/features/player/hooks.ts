import { createContext, useContext } from "react";
import type { PlayerContextValue } from "./types";
export const PlayerContext = createContext<PlayerContextValue | undefined>(
  undefined,
);

export function usePlayer(){
  const ctx = useContext(PlayerContext)
  if(ctx == undefined){
    throw new Error("PlayerProvider Is Used as a Parent For This Component")
  }
  return ctx
}