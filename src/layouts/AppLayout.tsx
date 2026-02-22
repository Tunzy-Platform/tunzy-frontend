import { Menubar } from "./Menubar";
import { Toaster } from "sonner";
import { PlayerCard } from "@/features/player/components/PlayerCard";
import { PlayerProvider } from "@/features/player/context";

export function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <PlayerProvider context={undefined}>
      <div className="flex h-svh flex-col overflow-hidden bg-background">
        {/* Header - fixed height, no grow */}
        <header className=" z-30 h-16 shrink-0 border-b bg-background/80 backdrop-blur-sm">
          <Menubar />
        </header>

        {/* Main content area – takes remaining space, scrolls internally */}
        <main className="flex-1 flex overflow-auto ">
          <div className="flex-1 m-2 md:m-10 min-w-0 ">{children}</div>
        </main>

        {/* Player – fixed height, stays at bottom in document flow */}
        <footer className="shrink-0 border-t bg-background/95 backdrop-blur-sm">
          <PlayerCard />
        </footer>

        {/* Toaster outside if you want global toasts (recommended) */}
        <Toaster />
      </div>
    </PlayerProvider>
  );
}
