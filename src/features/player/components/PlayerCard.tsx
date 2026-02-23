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
  const track = player.state.queue[currentIndex];

  return (
    <>
      <AudioPlayer
        src={String(track.stream_url)}
        player={player}
        title={track?.name}
        byline={track?.artist_name}
        thumbnail_src={track?.thumbnail}
        hasNext={true}
        hasPrevious={true}
        autoPlay={true}
        isShuffle={player.state.isShuffle}
        repeatMode={player.state.repeatMode}
      />
    </>
  );
}
