import { useEffect, useReducer, type ReactNode } from "react";
import type { PlayerStore } from "./types";
import { playerReducer } from "./reducer";
import { PlayerContext } from "./hooks";

const PlayerContextInitialValue: PlayerStore = {
  trackIndex: 0,
  queue: [],
  playback: [],
  playlistID: null,
  isPlaying: false,
  isShuffle: false,
  currentIndex: null,
};

export function PlayerProvider({
  children,
  context = PlayerContextInitialValue,
}: {
  children: ReactNode;
  context: PlayerStore | undefined;
}) {
  const [state, dispatch] = useReducer(playerReducer, context);

  useEffect(() => {
    dispatch({
      type: "BuildPlayback",
    });
  }, [state.playlistID]);

  useEffect(() => {
    dispatch({
      type: "StartPlaying",
    });
  }, [state.playback, state.currentIndex]);

  return (
    <PlayerContext value={{ state, playerDispatch: dispatch }}>
      {children}
    </PlayerContext>
  );
}
