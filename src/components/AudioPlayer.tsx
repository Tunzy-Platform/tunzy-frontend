import {
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon,
  ShuffleIcon,
  SkipForwardIcon,
  SkipBackIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ScrollingText } from "./ui/ScrollingText";
import type { PlayerContextValue } from "@/features/player/types";

export function AudioPlayer({
  src,
  player,
  title = "Audio Title",
  byline = "Artist Name",
  thumbnail_src = null,
  hasNext = false,
  hasPrevious = false,
  autoPlay = true,
  isShuffle = false,
  repeatMode = "off",
}: {
  src: string;
  player: PlayerContextValue;
  title: string;
  byline: string;
  thumbnail_src: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  autoPlay: boolean;
  isShuffle: boolean;
  repeatMode: "off" | "one" | "all";
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(player.state.isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  // const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const audio = audioRef.current;

  const playingFn = () => {
    if (audio == null) return;
    audio.play();
    setIsPlaying(true);
    player.playerDispatch({ type: "StartPlaying" });
  };

  const pauseFn = () => {
    if (audio == null) return;
    audio.pause();
    setIsPlaying(false);
    player.playerDispatch({ type: "PausePlaying" });
  };

  const onNext = () => {
    player.playerDispatch({ type: "NextTrack" });
  };

  const onPrevious = () => {
    player.playerDispatch({ type: "PreviousTrack" });
  };
  const onToggleShuffle = () => {
    player.playerDispatch({ type: "ToggleShuffle" });
  };
  const onCycleRepeat = () => {
    player.playerDispatch({ type: "ToggleRepeatMode" });
  };

  useEffect(() => {
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      player.playerDispatch({ type: "NextTrack" }),
    );

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      player.playerDispatch({ type: "PreviousTrack" });
    });

    navigator.mediaSession.setActionHandler("play", playingFn);
    navigator.mediaSession.setActionHandler("pause", pauseFn);
  });

  useEffect(() => {
    if (
      player == undefined ||
      player.state.currentIndex == null ||
      player.state.playback.length == 0
    ) {
      return;
    }
    const currentIndex = player.state.playback[player.state.currentIndex];
    const track = player.state.queue[currentIndex];
    navigator.mediaSession.metadata = new MediaMetadata({
      album: track.album || undefined,
      artist: track.artist_name || "Tunzy",
      title: track.name,
      artwork: track.thumbnail
        ? [
            {
              src: track.thumbnail,
              sizes: "512x512",
              type: "image/png",
            },
          ]
        : undefined,
    });
  }, [player]);
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number }) => {
      if (isDragging && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const percent = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        const newTime = percent * duration;
        if (audioRef.current) {
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      const audioEl = audioRef.current;
      if (!audioEl) return;

      // Repeat one: restart same track
      if (repeatMode === "one") {
        audioEl.currentTime = 0;
        audioEl.play();
        return;
      }

      // Move to next track if available
      if (hasNext) {
        setIsPlaying(false); // reset local UI state
        onNext();
        return;
      }

      // No next track → stop playing
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (autoPlay) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Auto-play prevented:", error);
        });
    }
  }, [autoPlay, src]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const newTime = percent * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  // const cyclePlaybackRate = () => {
  //   const rates = [1, 1.25, 1.5, 1.75, 2];
  //   const currentIndex = rates.indexOf(playbackRate);
  //   const nextRate = rates[(currentIndex + 1) % rates.length];
  //   setPlaybackRate(nextRate);
  //   if (audioRef.current) {
  //     audioRef.current.playbackRate = nextRate;
  //   }
  // };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full h-full min-h-10 md:min-h-20 rounded-2xl overflow-hidden backdrop-blur-3xl relative font-sans">
      {/* Audio element */}
      <audio ref={audioRef} src={src} />

      {/* Mobile Version */}
      <div
        className="relative z-10 h-full flex-col md:flex-row md:items-center md:px-5 md:gap-3 md:hidden"
        style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.3s" }}
      >
        {/* Mobile: Info section */}
        <div className="text-center w-full my-1 ">
          <ScrollingText text={title} />
        </div>
        {/* c */}

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-1">
          {/* Shuffle */}
          <button
            onClick={() => onToggleShuffle && onToggleShuffle()}
            className={`p-1.5 rounded-lg transition-colors text-white text-xs font-medium min-w-9 ${
              isShuffle ? "bg-white/20" : "hover:bg-white/10"
            }`}
            aria-label="Toggle shuffle"
          >
            <ShuffleIcon />
          </button>

          {/* Previous Track */}
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`p-1.5 rounded-lg transition-colors ${
              hasPrevious
                ? "hover:bg-white/10 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Previous track"
          >
            <SkipBackIcon />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          {/* Next Track */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`p-1.5 rounded-lg transition-colors ${
              hasNext
                ? "hover:bg-white/10 cursor-pointer"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Next track"
          >
            <SkipForwardIcon />
          </button>

          {/* Repeat */}
          <button
            onClick={() => onCycleRepeat && onCycleRepeat()}
            className={`p-1.5 rounded-lg transition-colors text-white text-xs font-medium min-w-9 ${
              repeatMode !== "off" ? "bg-white/20" : "hover:bg-white/10"
            }`}
            aria-label={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === "off" && <RepeatIcon />}
            {repeatMode === "one" && <Repeat1Icon />}
            {repeatMode === "all" && <RepeatIcon />}
          </button>

          {/* Right: Volume Controls */}
          <div className="flex items-center justify-end gap-1.5 shrink-0">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 32 32"
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M16.5 20.486v-8.972c0-1.537-2.037-2.08-2.802-.745l-1.026 1.79a2.5 2.5 0 0 1-.8.85l-1.194.78A1.5 1.5 0 0 0 10 15.446v1.11c0 .506.255.978.678 1.255l1.194.782a2.5 2.5 0 0 1 .8.849l1.026 1.79c.765 1.334 2.802.792 2.802-.745Z"
                  fill="white"
                />
                {!isMuted && volume > 0.5 && (
                  <path
                    d="M18 21C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11"
                    opacity={isMuted ? 0 : 1}
                  />
                )}
                {!isMuted && (
                  <path
                    d="M18.5 18C19.6046 18 20.5 17.1046 20.5 16C20.5 14.8954 19.6046 14 18.5 14"
                    opacity={isMuted ? 0 : 1}
                  />
                )}
                {isMuted && (
                  <>
                    <path d="M23 18L19 14" />
                    <path d="M23 14L19 18" />
                  </>
                )}
              </svg>
            </button>

            {/* Volume Slider */}
            <div className="relative w-20 h-6 flex items-center group/volume">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer 
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-2.5 
                  [&::-webkit-slider-thumb]:h-2.5 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-2.5 
                  [&::-moz-range-thumb]:h-2.5 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:transition-all
                  [&::-moz-range-thumb]:hover:scale-110"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 w-full max-w-2xl">
          {/* Current time */}
          <span className="text-[10px] text-white/70 min-w-8 text-right">
            {formatTime(currentTime)}
          </span>

          {/* Progress bar */}
          <div
            className="relative flex-1 h-6 cursor-pointer group flex items-center"
            onClick={handleSeek}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
          >
            <div
              ref={progressRef}
              className="relative w-full h-1 bg-white/25 rounded-full overflow-visible group-hover:h-1.5 transition-all"
            >
              {/* Buffered indicator */}
              <div
                className="absolute h-full bg-white/40 rounded-full transition-all pointer-events-none"
                style={{ width: `${Math.min(progress + 15, 100)}%` }}
              />
              {/* Progress */}
              <div
                className="absolute h-full bg-white rounded-full transition-all pointer-events-none"
                style={{ width: `${progress}%` }}
              />
              {/* Thumb - show on hover or drag */}
              <div
                className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${progress}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: isDragging ? 1 : 0,
                  transition: "opacity 0.2s",
                }}
              />
            </div>
          </div>

          {/* Total duration */}
          <span className="text-[10px] text-white/70 min-w-8 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Desktop Version */}
      <div
        className=" relative z-10 h-full  md:flex-row md:items-center md:px-5 md:gap-3 hidden md:flex "
        style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.3s" }}
      >
        {/* Left: Thumbnail and Info */}
        <div className="flex items-center gap-3 shrink-0 max-w-50 w-50">
          {thumbnail_src && (
            <div className="relative w-14 h-14 rounded-md overflow-hidden shadow-lg shrink-0">
              <img
                src={thumbnail_src}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 max-w-45">
            <ScrollingText text={title} />
            <h2 className="text-white text-xs font-normal leading-tight m-0 opacity-60 truncate">
              {byline}
            </h2>
          </div>
        </div>

        {/* Center: Controls and Progress Bar */}
        <div className="flex-1 flex flex-col items-center justify-center ">
          {/* Control buttons */}
          <div className="flex items-center justify-center gap-1">
            {/* Shuffle */}
            <button
              onClick={() => onToggleShuffle && onToggleShuffle()}
              className={`p-1.5 rounded-lg transition-colors text-white text-xs font-medium min-w-9 ${
                isShuffle ? "bg-white/20" : "hover:bg-white/10"
              }`}
              aria-label="Toggle shuffle"
            >
              <ShuffleIcon />
            </button>
            {/* Playback rate
            <button
              onClick={cyclePlaybackRate}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white text-xs font-medium min-w-9"
              aria-label={`Playback rate: ${playbackRate}x`}
            >
              {playbackRate}x
            </button> */}

            {/* Previous Track */}
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className={`p-1.5 rounded-lg transition-colors ${
                hasPrevious
                  ? "hover:bg-white/10 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Previous track"
            >
              <SkipBackIcon />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            {/* Next Track */}
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-lg transition-colors ${
                hasNext
                  ? "hover:bg-white/10 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
              aria-label="Next track"
            >
              <SkipForwardIcon />
            </button>
            {/* Repeat */}
            <button
              onClick={() => onCycleRepeat && onCycleRepeat()}
              className={`p-1.5 rounded-lg transition-colors text-white text-xs font-medium min-w-9 ${
                repeatMode !== "off" ? "bg-white/20" : "hover:bg-white/10"
              }`}
              aria-label={`Repeat mode: ${repeatMode}`}
            >
              {repeatMode === "off" && <RepeatIcon />}
              {repeatMode === "one" && <Repeat1Icon />}
              {repeatMode === "all" && <RepeatIcon />}
            </button>
          </div>
          {/* Progress bar - Desktop */}
          <div className="flex items-center justify-center gap-2 w-full max-w-2xl">
            {/* Current time */}
            <span className="text-[10px] text-white/70 min-w-8 text-right">
              {formatTime(currentTime)}
            </span>

            {/* Progress bar */}
            <div
              className="relative flex-1 h-6 cursor-pointer group flex items-center"
              onClick={handleSeek}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
            >
              <div
                ref={progressRef}
                className="relative w-full h-1 bg-white/25 rounded-full overflow-visible group-hover:h-1.5 transition-all"
              >
                {/* Buffered indicator */}
                <div
                  className="absolute h-full bg-white/40 rounded-full transition-all pointer-events-none"
                  style={{ width: `${Math.min(progress + 15, 100)}%` }}
                />
                {/* Progress */}
                <div
                  className="absolute h-full bg-white rounded-full transition-all pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
                {/* Thumb - show on hover or drag */}
                <div
                  className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: isDragging ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Total duration */}
            <span className="text-[10px] text-white/70 min-w-8 text-left">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume Controls */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 32 32"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M16.5 20.486v-8.972c0-1.537-2.037-2.08-2.802-.745l-1.026 1.79a2.5 2.5 0 0 1-.8.85l-1.194.78A1.5 1.5 0 0 0 10 15.446v1.11c0 .506.255.978.678 1.255l1.194.782a2.5 2.5 0 0 1 .8.849l1.026 1.79c.765 1.334 2.802.792 2.802-.745Z"
                fill="white"
              />
              {!isMuted && volume > 0.5 && (
                <path
                  d="M18 21C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11"
                  opacity={isMuted ? 0 : 1}
                />
              )}
              {!isMuted && (
                <path
                  d="M18.5 18C19.6046 18 20.5 17.1046 20.5 16C20.5 14.8954 19.6046 14 18.5 14"
                  opacity={isMuted ? 0 : 1}
                />
              )}
              {isMuted && (
                <>
                  <path d="M23 18L19 14" />
                  <path d="M23 14L19 18" />
                </>
              )}
            </svg>
          </button>

          {/* Volume Slider */}
          <div className="relative w-20 h-6 flex items-center group/volume">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-2.5 
                [&::-webkit-slider-thumb]:h-2.5 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-white 
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:transition-all
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:w-2.5 
                [&::-moz-range-thumb]:h-2.5 
                [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-white 
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:shadow-lg
                [&::-moz-range-thumb]:transition-all
                [&::-moz-range-thumb]:hover:scale-110"
              style={{
                background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
