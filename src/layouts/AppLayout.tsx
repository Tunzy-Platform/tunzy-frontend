import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Menubar } from "./Menubar";
import { Toaster } from "sonner";
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen pt-14 flex flex-col">
      <Menubar />
      <SidebarProvider>
        <div className="flex w-full flex-1 ">
          <AppSidebar />
          <main className=" px-4  w-full">
            <SidebarTrigger />
            {children}
            <Toaster />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
