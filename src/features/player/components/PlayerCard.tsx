import "media-chrome/react";
import "media-chrome/react/menu";
import { MediaTheme } from "media-chrome/react/media-theme";
import { AudioPlayer } from "@/components/AudioPlayer";

export function PlayerCard() {
  return (
    <>
      <AudioPlayer
        src="https://stream.mux.com/fXNzVtmtWuyz00xnSrJg4OJH6PyNo6D02UzmgeKGkP5YQ/low.mp4"
        title="My Love"
        byline="Ali"
        posterUrl="https://i.scdn.co/image/ab67616d00004851e691217483df8798445c82e2"
      />
      {/* <MediaTheme
        // template="media-theme-tailwind-audio"
        template="media-theme-sutro-audio"
        style={{ "--media-primary-color": "#1c1c1c" }}
        className="w-full flex"
      >
        <audio
          slot="media"
          src="https://stream.mux.com/fXNzVtmtWuyz00xnSrJg4OJH6PyNo6D02UzmgeKGkP5YQ/low.mp4"
          playsInline
          crossOrigin="anonymous"
        ></audio>
      </MediaTheme> */}
    </>
  );
}
