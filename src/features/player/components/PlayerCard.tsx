import { AudioPlayer } from "@/components/AudioPlayer";

import { usePlayer } from "../hooks";

export function PlayerCard() {
  const player = usePlayer();
  if (player == undefined || player.state.currentIndex == null) {
    return <></>;
  }
  const currentIndex = player.state.currentIndex;
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
      />
    </>
  );
}
