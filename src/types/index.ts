// Chat / conversation
export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type ConversationProps = {
  messages: Message[]
  isBotThinking?: boolean
  className?: string
}

export type ChatProps = {
  onSend?: (text: string) => void
  disabled?: boolean
}
