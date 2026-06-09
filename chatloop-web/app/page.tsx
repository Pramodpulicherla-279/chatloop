import { ChatProvider } from "@/src/components/context/ChatContext";
import ChatHeader from "@/src/components/chat/ChatHeader";
import ChatSidebar from "@/src/components/chat/ChatSidebar";
import ConnectionStatus from "@/src/components/chat/ConnectionStatus";
import MessageInput from "@/src/components/chat/MessageInput";
import MessageList from "@/src/components/chat/MessageList";
import BeforeUnloadGuard from "@/src/components/chat/BeforeUnloadGuard";

export default function ChatPage() {
  return (
    <ChatProvider>
      <BeforeUnloadGuard />
      <div className="flex flex-col h-dvh overflow-hidden bg-background">
        <ChatHeader />

        <div className="flex flex-1 overflow-hidden min-h-0">
          <ChatSidebar />

          <main className="flex flex-1 flex-col overflow-hidden min-h-0">
            <ConnectionStatus />

            <div className="flex flex-1 overflow-hidden min-h-0">
              <MessageList />
            </div>

            <MessageInput />
          </main>
        </div>
      </div>
    </ChatProvider>
  );
}
