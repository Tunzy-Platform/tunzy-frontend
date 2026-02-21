import { useEffect, useReducer, type ReactNode } from "react";
import { type PlayerStore } from "./types";
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
  repeatMode: "all",
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
    console.log("useEffect BuildPlayback");
    dispatch({
      type: "BuildPlayback",
      shuffle: state.isShuffle,
    });
  }, [state.isShuffle, state.playlistID, state.queue]);

  useEffect(() => {
    console.log("useEffect StartPlaying");

    dispatch({
      type: "StartPlaying",
    });
  }, [state.playback, state.trackIndex]);

  return (
    <PlayerContext value={{ state, playerDispatch: dispatch }}>
      {children}
    </PlayerContext>
  );
}
