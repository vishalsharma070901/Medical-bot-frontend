import { useState, useCallback } from "react";
import { AppSidebar } from "./Components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Chat from "../Chat";
import Conversation from "../Conversation";
import type { Message } from "@/types";
import axios from "axios";

export default function MainSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const handleSend = useCallback(async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsBotThinking(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        input: text,
      });
      const content =
        typeof response.data?.response === "string"
          ? response.data.response
          : "Something went wrong.";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn't reach the server. Check that the backend is running and try again.",
        },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-0 h-screen">
        <header className="shrink-0 flex items-center gap-2 w-full p-4 pb-2 ">
          <SidebarTrigger className="-ml-1 w-10 h-10" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h6 className="text-xl font-extralight">HealthMate</h6>
        </header>
        <Conversation
          messages={messages}
          isBotThinking={isBotThinking}
          className="flex-1 min-h-0"
        />
        <div className="shrink-0 p-4 pt-2 flex justify-center bg-background">
          <Chat onSend={handleSend} disabled={isBotThinking} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
