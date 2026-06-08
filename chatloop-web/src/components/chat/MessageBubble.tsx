import { MessageType } from "@/src/hooks/useChat";

export default function MessageBubble({ message }: { message: MessageType }) {
  const isMe = message.sender === "me";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isMe
            ? "gradient-brand text-white rounded-br-sm shadow-violet-500/20"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        }`}
      >
        {message.text}
      </div>
      <span className="text-[11px] text-muted-foreground px-1">{time}</span>
    </div>
  );
}
