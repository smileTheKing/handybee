"use client"
import { ChatPage } from '@/components/chat'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import { useSearchParams } from 'next/navigation'

export default function Chat() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <DynamicBreadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Messages', href: '/chat' }
          ]}
        />
      </div>
      <ChatPage initialOrderId={orderId} />
    </div>
  )
} 