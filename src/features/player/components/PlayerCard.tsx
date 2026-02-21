import { AudioPlayer } from "@/components/AudioPlayer";

import { usePlayer } from "../hooks";

export function PlayerCard() {
  const player = usePlayer();
  if (
    player == undefined ||
    player.state.currentIndex == null ||
    player.state.playback.length == 0
  ) {
    return <></>;
  }
  const currentIndex = player.state.playback[player.state.currentIndex];
  console.log(
    "current track",
    currentIndex,
    player.state.currentIndex,
    player.state.playback,
  );
  return (
    <>
      <AudioPlayer
        src={String(player.state.queue[currentIndex].stream_url)}
        title={player.state.queue[currentIndex]?.name}
        byline={player.state.queue[currentIndex]?.artist_name}
        thumbnail_src={player.state.queue[currentIndex]?.thumbnail}
        onNext={() => player.playerDispatch({ type: "NextTrack" })}
        onPrevious={() => player.playerDispatch({ type: "PreviousTrack" })}
        hasNext={true}
        hasPrevious={true}
        autoPlay={true}
        isShuffle={player.state.isShuffle}
        onToggleShuffle={() => player.playerDispatch({ type: "ToggleShuffle" })}
        repeatMode={player.state.repeatMode}
        onCycleRepeat={() =>
          player.playerDispatch({ type: "ToggleRepeatMode" })
        }
      />
    </>
  );
}
