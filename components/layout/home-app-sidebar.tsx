import { Home, Inbox, Search, Settings, MessageCircle, User, Briefcase } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Gigs",
    url: "/gigs",
    icon: Briefcase,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function HomeAppSideBar() {
  return (
    <Sidebar >
      <SidebarHeader className="px-6">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuItem><Image
          width={60}
          height={60}
          src={"/assets/images/bee.png"}
          alt="Logo"
          /></SidebarMenuItem>
        </SidebarMenuItem>
      </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
         
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-6">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}