import { auth } from '@/app/config/auth'
import { redirect } from 'next/navigation'
import { OrderList } from '@/components/orders'
import { prisma } from '@/prisma/prisma'







export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  
  
  // Fetch orders where user is either buyer or seller
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id },
      ],
    },
    include: {
      gig: {
        select: {
          title: true,
          images: true,
        },
      },
      package: {
        select: {
          name: true,
          price: true,
          deliveryTime: true,
        },
      },
      buyer: {
        select: {
          name: true,
          image: true,
        },
      },
      seller: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }).then(orders => orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString()
  })))

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-gray-600">
          Manage your orders and track their progress
        </p>
      </div>

      <OrderList orders={orders} userId={session.user.id} />
    </div>
  )
} 