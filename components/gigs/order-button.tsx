"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Check, MessageCircle } from 'lucide-react'

interface Package {
  id: string
  name: string
  description: string
  price: number
  deliveryTime: number
  revisions: number
  features: string[]
}

interface OrderButtonProps {
  package: Package
  gigId: string
  sellerId: string
  currentUserId?: string
}

export function OrderButton({ package: pkg, gigId, sellerId, currentUserId }: OrderButtonProps) {
  const [isOrdering, setIsOrdering] = useState(false)

  const handleOrder = async () => {
    if (!currentUserId) {
      // Redirect to login
      window.location.href = '/login'
      return
    }

    if (currentUserId === sellerId) {
      alert('You cannot order your own gig!')
      return
    }

    setIsOrdering(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigId,
          packageId: pkg.id,
          total: pkg.price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      // Redirect to order page or show success message
      window.location.href = `/orders/${order.id}`
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsOrdering(false)
    }
  }

  return (
    <Card className="border-2 hover:border-blue-300 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pkg.name}</CardTitle>
          <Badge variant="outline" className="text-green-600 border-green-600">
            ${pkg.price}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{pkg.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{pkg.deliveryTime} days delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>{pkg.revisions} revisions</span>
          </div>
        </div>

        <div className="space-y-2">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleOrder}
          disabled={isOrdering}
          className="w-full"
          size="lg"
        >
          {isOrdering ? 'Creating Order...' : `Order Now - $${pkg.price}`}
        </Button>
      </CardContent>
    </Card>
  )
} 