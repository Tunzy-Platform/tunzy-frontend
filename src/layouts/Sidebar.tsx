import {
  Sidebar,
  SidebarMenuButton,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Item,
  ItemMedia,
  ItemTitle,
  ItemContent,
  ItemActions,
} from "@/components/ui/item";
import {
  HomeIcon,
  ChevronRightIcon,
  SettingsIcon,
  DownloadIcon,
} from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar className="rounded-3xl overflow-hidden bg-background">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="pl-0">
              <Item variant="default" size="sm" asChild className=" w-full">
                <a href="#">
                  <ItemMedia>
                    <HomeIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Home</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              </Item>
            </SidebarMenuButton>

            <SidebarMenuButton className="pl-0">
              <Item variant="default" size="sm" asChild className=" w-full">
                <a href="#">
                  <ItemMedia>
                    <DownloadIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Downloads</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              </Item>
            </SidebarMenuButton>

            <SidebarMenuButton className="pl-0">
              <Item variant="default" size="sm" asChild className=" w-full">
                <a href="#">
                  <ItemMedia>
                    <SettingsIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Settings</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              </Item>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
