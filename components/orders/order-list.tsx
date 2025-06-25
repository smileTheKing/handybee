import { OrderCard } from './order-card'

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

interface OrderListProps {
  orders: Order[]
  userId: string
}

export function OrderList({ orders, userId }: OrderListProps) {
  const groupedOrders = orders.reduce((acc, order) => {
    const status = order.status.toLowerCase()
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(order)
    return acc
  }, {} as Record<string, Order[]>)

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedOrders).map(([status, orders]) => (
        <div key={status}>
          <h2 className="mb-4 text-xl font-semibold">
            {statusLabels[status as keyof typeof statusLabels]} ({orders.length})
          </h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isBuyer={order.buyer.name === userId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 