import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatWindow } from "@/components/ChatWindow";
import { chatsApi } from "@/lib/api";
import type { Database } from "@/lib/supabase";

type Chat = Database['public']['Tables']['chats']['Row'];

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  // Handle chat selection from URL state or props
  useEffect(() => {
    const state = location.state as { selectedChatId?: string } | null;
    if (state?.selectedChatId) {
      loadChat(state.selectedChatId);
      // Clear state after reading
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChat(true);
      } else if (!selectedChat) {
        setShowChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedChat]);

  const loadChat = async (chatId: string) => {
    try {
      const chat = await chatsApi.getChat(chatId);
      if (chat) {
        setSelectedChat(chat);
        if (isMobile) {
          setShowChat(true);
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBack = () => {
    if (isMobile) {
      setShowChat(false);
      setSelectedChat(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-subtle py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Messages
          </h1>
          <p className="text-muted-foreground">
            Keep in touch with future roommates or anyone interested in your place!
          </p>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: 0 }}>
          {/* Conversations List */}
          <div className={`${isMobile && showChat ? 'hidden' : 'block'} md:block h-full min-h-0`}>
            <ConversationsList
              selectedChatId={selectedChat?.id || null}
              onSelectChat={handleSelectChat}
            />
          </div>

          {/* Chat Window */}
          <div className={`${isMobile && !showChat ? 'hidden' : 'block'} md:block h-full min-h-0`}>
            <ChatWindow chat={selectedChat} onBack={handleBack} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;