import { AudioPlayer } from "@/components/AudioPlayer";
import { useContext } from "react";
import { PlayerContext } from "../contexts";

export function PlayerCard() {
  const playerContext = useContext(PlayerContext);
  if (playerContext == null || playerContext.track == null) {
    return <></>;
  }
  return (
    <>
      <AudioPlayer
        src={String(playerContext.track.stream_url)}
        title={playerContext.track.name}
        byline={playerContext.track.artist_name}
        thumbnail_src={playerContext.track.thumbnail}
        onNext={null}
        onPrevious={null}
        hasNext={false}
        hasPrevious={false}
        autoPlay={true}
      />
    </>
  );
}
