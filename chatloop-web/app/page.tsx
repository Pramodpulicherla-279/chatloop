import { ChatProvider } from "@/src/components/context/ChatContext";
import ChatHeader from "@/src/components/chat/ChatHeader";
import ChatSidebar from "@/src/components/chat/ChatSidebar";
import ConnectionStatus from "@/src/components/chat/ConnectionStatus";
import MessageInput from "@/src/components/chat/MessageInput";
import MessageList from "@/src/components/chat/MessageList";

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-zinc-950">
        <ChatHeader />

        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <ConnectionStatus />

            <div className="flex flex-1 overflow-hidden">
              <MessageList />
            </div>

            <MessageInput />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}