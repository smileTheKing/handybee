import { auth } from '@/app/config/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/prisma/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  reviewer: {
    name: string | null
    image: string | null
  }
}

interface Package {
  id: string
  name: string
  description: string
  price: number
  deliveryTime: number
  revisions: number
  features: string[]
}

interface Order {
  id: string
  status: OrderStatus
  total: number
  createdAt: Date
  buyerId: string
  sellerId: string
  gig: {
    id: string
    title: string
    images: string[]
  }
  package: Package
  buyer: {
    id: string
    name: string | null
    image: string | null
  }
  seller: {
    id: string
    name: string | null
    image: string | null
  }
  reviews: Review[]
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  DISPUTED: 'bg-orange-100 text-orange-800',
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DISPUTED: 'Disputed',
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
    include: {
      gig: {
        select: {
          id: true,
          title: true,
          images: true,
        },
      },
      package: true,
      buyer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  }) as Order | null

  if (!order) {
    redirect('/orders')
  }

  const isBuyer = order.buyerId === session.user.id
  const isSeller = order.sellerId === session.user.id

  if (!isBuyer && !isSeller) {
    redirect('/orders')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="font-medium">${order.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Order Date</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gig Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative h-48 w-full">
                <Image
                  src={order?.gig?.images[0]|| '/assets/images/placeholder.png'}
                  alt={order.gig.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">{order.gig.title}</h3>
              <Link
                href={`/gigs/${order.gig.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View Gig
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{order.package.name}</h3>
              <p className="text-sm text-gray-600">
                {order.package.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Delivery Time</span>
                  <span className="font-medium">
                    {order.package.deliveryTime} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Revisions</span>
                  <span className="font-medium">
                    {order.package.revisions} revisions
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <ul className="list-inside list-disc space-y-1">
                  {order.package.features.map((feature: string) => (
                    <li key={feature} className="text-sm text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.reviews.length > 0 ? (
                order.reviews.map((review: Review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8">
                        <Image
                          src={review.reviewer.image || '/placeholder.png'}
                          alt={review.reviewer.name || 'Reviewer'}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {review.reviewer.name || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12">
                  <Image
                    src={isBuyer ? order.seller.image || '/assets/images/placeholder.pngg' : order.buyer.image || '/assets/images/placeholder.png'}
                    alt={isBuyer ? order.seller.name || 'Seller' : order.buyer.name || 'Buyer'}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {isBuyer ? order.seller.name : order.buyer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isBuyer ? 'Seller' : 'Buyer'}
                  </p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/chat?orderId=${order.id}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 