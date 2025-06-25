import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MessageSquare } from 'lucide-react'

interface Order {
  id: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
  total: number
  createdAt: string
  gig: {
    title: string
    images: string[]
  }
  package: {
    name: string
    price: number
    deliveryTime: number
  }
  buyer: {
    name: string | null
    image: string | null
  }
  seller: {
    name: string | null
    image: string | null
  }
}

interface OrderCardProps {
  order: Order
  isBuyer: boolean
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-orange-100 text-orange-800',
}

const statusLabels = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
}

export function OrderCard({ order, isBuyer }: OrderCardProps) {
  const otherParty = isBuyer ? order.seller : order.buyer

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Gig Image */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={order.gig.images[0] || '/assets/images/placeholder.png'}
            alt={order.gig.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Order Details */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">
                <Link href={`/gigs/${order.id}`} className="hover:underline">
                  {order.gig.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Package: {order.package.name}
              </p>
            </div>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Ordered {new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Delivery in {order.package.deliveryTime} days</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={otherParty.image || '/assets/images/default-avatar.png'}
                alt={otherParty.name || 'User'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm">
                {isBuyer ? 'Seller: ' : 'Buyer: '}
                {otherParty.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders/${order.id}/messages`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders/${order.id}`}>View Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 