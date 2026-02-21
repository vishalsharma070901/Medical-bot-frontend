import { MessageCircle } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Your Chats",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Chat 1",
          url: "/chat/1",
        },
        {
          title: "Chat 2",
          url: "/chat/2",
        },
        {
          title: "Chat 3",
          url: "/chat/3",
        },
      ],
    },
  ],
  projects: [
    {
      name: "New Chat",
      url: "/",
      icon: MessageCircle,
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavProjects projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
