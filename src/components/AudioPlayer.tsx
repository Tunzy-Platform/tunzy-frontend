import { useState, useRef, useEffect } from "react";

export function AudioPlayer({
  src,
  title = "Audio Title",
  byline = "Artist Name",
  thumbnail_src = null,
  onNext = null,
  onPrevious = null,
  hasNext = false,
  hasPrevious = false,
  autoPlay = true,
}: {
  src: string;
  title: string;
  byline: string;
  thumbnail_src: string | null;
  onNext: CallableFunction | null;
  onPrevious: CallableFunction | null;
  hasNext: boolean;
  hasPrevious: boolean;
  autoPlay: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

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

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

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

      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full max-h-33 opacity-20"
          style={{
            filter: "blur(80px)",
            mixBlendMode: "plus-lighter",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full max-h-33 opacity-20"
          style={{
            filter: "blur(80px)",
            mixBlendMode: "plus-lighter",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 h-full flex ${
          isMobile
            ? "flex-col pb-4"
            : "md:flex-row md:items-center md:px-5 md:gap-3"
        }`}
        style={{ opacity: isDragging ? 0.4 : 1, transition: "opacity 0.3s" }}
      >
        {/* Left: Thumbnail and Info */}
        {!isMobile && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {thumbnail_src && (
              <div className="relative w-[56px] h-[56px] rounded-md overflow-hidden shadow-lg flex-shrink-0">
                <img
                  src={thumbnail_src}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 max-w-[180px]">
              <h1 className="text-white text-sm font-medium leading-tight m-0 truncate">
                {title}
              </h1>
              <h2 className="text-white text-xs font-normal leading-tight m-0 opacity-60 truncate">
                {byline}
              </h2>
            </div>
          </div>
        )}

        {/* Mobile: Info section */}
        {isMobile && (
          <div className="grid items-end mb-4">
            {thumbnail_src && (
              <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-lg">
                <img
                  src={thumbnail_src}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 w-full h-[100px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
                  }}
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-white text-sm font-normal leading-tight m-0 truncate">
                {title}
              </h1>
              <h2 className="text-white text-xs font-normal leading-tight m-0 opacity-60 truncate">
                {byline}
              </h2>
            </div>
          </div>
        )}

        {/* Center: Controls and Progress Bar */}
        <div className="flex-1 flex flex-col items-center justify-center ">
          {/* Control buttons */}
          <div className="flex items-center justify-center gap-1">
            {/* Playback rate */}
            <button
              onClick={cyclePlaybackRate}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white text-xs font-medium min-w-9"
              aria-label={`Playback rate: ${playbackRate}x`}
            >
              {playbackRate}x
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
              <svg
                className="w-6 h-6"
                viewBox="0 0 32 32"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 8v16" strokeWidth="2" />
                <path d="M24 8L12 16l12 8V8z" fill="white" stroke="none" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <svg
                className="w-15 h-15 self-center"
                viewBox="0 0 32 32"
                fill="none"
                stroke="white"
                strokeWidth="1"
              >
                {isPlaying ? (
                  <g>
                    <rect
                      x="10.5"
                      y="10.5"
                      width="4"
                      height="11"
                      rx="0.5"
                      fill="white"
                    />
                    <rect
                      x="17.5"
                      y="10.5"
                      width="4"
                      height="11"
                      rx="0.5"
                      fill="white"
                    />
                  </g>
                ) : (
                  <path
                    d="M20.7131 14.6976C21.7208 15.2735 21.7208 16.7265 20.7131 17.3024L12.7442 21.856C11.7442 22.4274 10.5 21.7054 10.5 20.5536L10.5 11.4464C10.5 10.2946 11.7442 9.57257 12.7442 10.144L20.7131 14.6976Z"
                    fill="white"
                  />
                )}
              </svg>
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
              <svg
                className="w-6 h-6"
                viewBox="0 0 32 32"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M24 8v16" strokeWidth="2" />
                <path d="M8 8l12 8-12 8V8z" fill="white" stroke="none" />
              </svg>
            </button>
          </div>

          {/* Progress bar - Desktop */}
          {!isMobile && (
            <div className="flex items-center justify-center gap-2 w-full max-w-2xl">
              {/* Current time */}
              <span className="text-[10px] text-white/70 min-w-[32px] text-right">
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
              <span className="text-[10px] text-white/70 min-w-[32px] text-left">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>

        {/* Right: Volume Controls */}
        {!isMobile && (
          <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
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
        )}
      </div>

      {/* Progress bar - Mobile (bottom) */}
      {isMobile && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 cursor-pointer group flex items-center px-4 z-20"
          onClick={handleSeek}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        >
          <div
            ref={progressRef}
            className="relative w-full h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-visible"
          >
            {/* Buffered indicator */}
            <div
              className="absolute h-full bg-white/40 rounded-full transition-all pointer-events-none"
              style={{ width: `${Math.min(progress + 10, 100)}%` }}
            />
            {/* Progress */}
            <div
              className="absolute h-full bg-white rounded-full transition-all pointer-events-none"
              style={{ width: `${progress}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-opacity pointer-events-none"
              style={{
                left: `${progress}%`,
                transform: "translate(-50%, -50%)",
                opacity: isDragging ? 1 : 0,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
