// Chat / conversation
export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  /** When true, show typewriter animation (only for newly generated assistant messages, not history). */
  animate?: boolean
}

export type ConversationProps = {
  messages: Message[]
  isBotThinking?: boolean
  isLoadingHistory?: boolean
  className?: string
}

export type ChatProps = {
  onSend?: (text: string) => void
  disabled?: boolean
}
