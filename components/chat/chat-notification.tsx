"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function ChatNotification() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const conversations: Array<{ unreadCount: number }> = await response.json()
        const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
        setUnreadCount(totalUnread)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <MessageCircle className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/chat" className="relative">
        <MessageCircle className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
} 