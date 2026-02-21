import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function ImageSpinnerButton({
  children,
  disabled,
  isLoading,
  setState,
  className = "",
  src,
  alt,
}: {
  children: ReactNode | null;
  disabled: boolean;
  isLoading: boolean;
  setState: CallableFunction;
  className?: string;
  src: string;
  alt: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const showSkeleton = !isLoaded || hasError;

  return (
    <Button
      className={`relative overflow-hidden bg-transparent ${className}`}
      variant="secondary"
      disabled={disabled}
      onClick={() => setState()}
    >
      {/* Skeleton (used for loading + error) */}
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>

      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Spinner />
        </div>
      )}
    </Button>
  );
}
