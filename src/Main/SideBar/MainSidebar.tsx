import { useState, useCallback, useEffect } from "react";
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
import { getSessionId, clearSessionId } from "@/utils/Helper";
import useStore from "@/store/store";
import { useParams, useNavigate } from "react-router-dom";

export default function MainSidebar() {
  const navigate = useNavigate();
  const { id: sessionIdFromUrl } = useParams<{ id: string }>();
  const messages = useStore((state) => state.messages);
  const setMessages = useStore((state) => state.setMessages);
  const addMessage = useStore((state) => state.addMessage);
  const refreshSessions = useStore((state) => state.refreshSessions);
  const tokenFromStore = useStore((state) => state.token);
  const token = tokenFromStore ?? localStorage.getItem("token");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!sessionIdFromUrl) {
      setMessages([]);
      clearSessionId();
      return;
    }
    let cancelled = false;
    setIsLoadingHistory(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/chat/history/${sessionIdFromUrl}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.messages ?? [];
        setMessages(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error fetching chat history:", err);
          setMessages([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionIdFromUrl, token, setMessages]);

  const handleSend = useCallback(
    async (text: string) => {
      const activeSessionId = sessionIdFromUrl ?? getSessionId();
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      addMessage(userMsg);
      setIsBotThinking(true);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/chat`,
          {
            input: text,
            session_id: activeSessionId,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        const content =
          typeof response.data?.response === "string"
            ? response.data.response
            : "Something went wrong.";
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content,
          animate: true,
        });
        const newSessionId = response.data?.session_id;
        if (!sessionIdFromUrl && newSessionId) {
          navigate(`/chat/${newSessionId}`, { replace: true });
          refreshSessions();
        }
      } catch (error) {
        console.error(error);
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn't reach the server. Check that the backend is running and try again.",
          animate: true,
        });
      } finally {
        setIsBotThinking(false);
      }
    },
    [addMessage, token, sessionIdFromUrl, navigate, refreshSessions],
  );

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
          isLoadingHistory={isLoadingHistory}
          className="flex-1 min-h-0"
        />
        <div className="shrink-0 p-4 pt-2 flex justify-center bg-background">
          <Chat
            onSend={handleSend}
            disabled={isBotThinking || isLoadingHistory}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
