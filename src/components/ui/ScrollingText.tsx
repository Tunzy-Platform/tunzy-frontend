import { useEffect, useRef, useState } from "react";

export function ScrollingText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    setShouldScroll(
      textRef.current.scrollWidth > containerRef.current.clientWidth,
    );
  }, [text]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative">
      <div
        ref={textRef}
        className={`whitespace-nowrap ${shouldScroll ? "animate-marquee" : ""}`}
      >
        {text}
      </div>
    </div>
  );
}
