import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import type { ChatProps } from "@/types"

const Chat = ({ onSend, disabled = false }: ChatProps) => {
  const [value, setValue] = useState("")

  const handleSubmit = () => {
    if (disabled) return
    const trimmed = value.trim()
    if (!trimmed || !onSend) return
    onSend(trimmed)
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={`flex items-end gap-2 w-full max-w-2xl border border-gray-200 rounded-2xl p-2 bg-white z-10 transition-opacity ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Thinking..." : "Ask me anything!"}
        rows={1}
        disabled={disabled}
        className="min-h-10 max-h-10 shadow-none resize-none overflow-y-auto focus-visible:ring-0 focus:border-none focus-visible:ring-offset-0 border-none disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
        aria-label="Send message"
      >
        <SendIcon className="size-5 mb-0.5" />
      </button>
    </div>
  )
}

export default Chat