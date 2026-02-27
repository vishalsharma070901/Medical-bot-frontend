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
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import useStore from "@/store/store";

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
  const sessionsVersion = useStore((state) => state.sessionsVersion);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const fetchSessionHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = response.data?.sessions ?? [];
      setSessionHistory(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error getting session history:", error);
    }
  }, []);
  useEffect(() => {
    fetchSessionHistory();
  }, [fetchSessionHistory, sessionsVersion]);

  const navMainItems = [
    {
      title: "Your Chats",
      url: "#",
      isActive: true,
      items: sessionHistory.map((session) => ({
        title: session.title,
        url: `/chat/${session.session_id}`,
        icon: MessageCircle,
      })),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
        <NavProjects projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
