import { useRef, useEffect, useState } from "react"
import { Bot, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ConversationProps } from "@/types"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TYPEWRITER_SPEED_MS = 2

function TypewriterMarkdown({
  content,
  messageId,
  className = "",
}: {
  content: string
  messageId: string
  className?: string
}) {
  const normalized = content.replace(/\n{3,}/g, "\n\n")
  const [displayedLength, setDisplayedLength] = useState(0)
  const prevMessageId = useRef<string | null>(null)

  useEffect(() => {
    if (prevMessageId.current !== messageId) {
      prevMessageId.current = messageId
      setDisplayedLength(0)
    }
  }, [messageId])

  useEffect(() => {
    if (displayedLength >= normalized.length) return
    const t = setTimeout(() => {
      setDisplayedLength((n) => Math.min(n + 1, normalized.length))
    }, TYPEWRITER_SPEED_MS)
    return () => clearTimeout(t)
  }, [displayedLength, normalized.length])

  const visible = normalized.slice(0, displayedLength)
  const isComplete = displayedLength >= normalized.length

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{visible}</ReactMarkdown>
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 align-middle bg-current animate-pulse ml-0.5" aria-hidden />
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 size-8 rounded-full flex items-center justify-center bg-muted">
        <Bot className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 max-w-[85%] items-start">
        <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm bg-white border border-gray-200">
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
            <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
            <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}

const Conversation = ({ messages, isBotThinking = false, className = "" }: ConversationProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, isBotThinking])

  return (
    <div className={`flex flex-col flex-1 min-h-0 overflow-hidden ${className}`}>
      <ScrollArea className="flex-1 min-h-0 w-full overflow-hidden">
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center mt-30  justify-center flex-1 min-h-[40vh] text-center text-muted-foreground">
              <Bot className="size-12 mb-3 opacity-40" />
              <p className="text-sm">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id}  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div  className={`shrink-0 size-8 rounded-full flex items-center justify-center ${ msg.role === "user"  ? "bg-primary text-primary-foreground"  : "bg-muted" }`} >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4 text-muted-foreground"/>
                    )}
                  </div>
                  <div
                    className={`flex flex-col gap-1 max-w-[85%] ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-white"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <TypewriterMarkdown
                          content={msg.content}
                          messageId={msg.id}
                          className="markdown-response "
                        />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isBotThinking && <TypingIndicator />}
              {messages.length > 0 && (
                <p className="text-xs text-muted-foreground text-center pb-2 pt-1">
                  Disclaimer: This is for informational purposes only. Always consult a healthcare professional for medical advice.
                </p>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Conversation;
