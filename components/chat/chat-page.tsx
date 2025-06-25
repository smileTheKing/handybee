"use client"
import { useState } from 'react'
import { ConversationList } from './conversation-list'
import { ChatMessages } from './chat-messages'
import { MessageCircle } from 'lucide-react'

interface Conversation {
  id: string
  orderId: string
  otherUser: {
    id: string
    name: string
    image: string
  }
  gig: {
    id: string
    title: string
    images: string[]
  }
  lastMessage: {
    id: string
    content: string
    createdAt: string
    sender: {
      id: string
      name: string
      image: string
    }
  } | null
  totalMessages: number
  unreadCount: number
  status: string
  createdAt: string
  updatedAt: string
}

interface ChatPageProps {
  initialOrderId?: string | null
}

export function ChatPage({ initialOrderId }: ChatPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleBack = () => {
    setSelectedConversation(null)
  }

  // If initialOrderId is provided, we'll need to fetch the conversation data
  // For now, we'll just log it
  if (initialOrderId) {
    console.log('Initial order ID:', initialOrderId)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Conversation List */}
      <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-96`}>
        <ConversationList
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Chat Messages */}
      {selectedConversation ? (
        <div className="flex-1">
          <ChatMessages
            orderId={selectedConversation.orderId}
            otherUser={selectedConversation.otherUser}
            gig={selectedConversation.gig}
            onBack={handleBack}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-sm">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
} 