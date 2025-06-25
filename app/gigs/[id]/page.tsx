"use client"
import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { Star, MessageCircle, Heart, Share2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderButton } from '@/components/gigs/order-button'
import { DynamicBreadcrumb, generateGigBreadcrumbs } from '@/components/ui/dynamic-breadcrumb'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface GigDetailPageProps {
  params: Promise<{
    id: string
  }>
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

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  reviewer: {
    name: string
    image: string
  }
}

interface Seller {
  id: string
  name: string
  image: string
  level: string
  title: string
  description: string
  responseTime: string
  skills: string[]
  languages: string[]
  rating: number
  reviewCount: number
  _count: {
    gigs: number
    receivedReviews: number
  }
}

interface Gig {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  price: number
  images: string[]
  rating: number
  seller: Seller
  packages: Package[]
  reviews: Review[]
  _count: {
    reviews: number
    orders: number
  }
}

export default function GigDetailPage({ params }: GigDetailPageProps) {
  const { data: session } = useSession()
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Unwrap the params Promise
  const { id } = use(params)

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await fetch(`/api/gigs/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch gig')
        }
        const data = await response.json()
        setGig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [id])

  const handleSave = () => {
    setIsSaved(!isSaved)
    // TODO: Implement save functionality with API
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gig?.title,
          text: gig?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  }

  const handleContactSeller = () => {
    if (!session?.user) {
      window.location.href = '/login'
      return
    }
    // TODO: Implement chat functionality
    window.location.href = `/chat?orderId=${gig?.id}`
  }

  const displayedReviews = showAllReviews ? gig?.reviews : gig?.reviews.slice(0, 3)

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-96 bg-gray-200 rounded-lg" />
              <div className="h-64 bg-gray-200 rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="h-48 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !gig) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gig Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The gig you are looking for does not exist.'}</p>
          <Link href="/gigs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gigs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  // Generate dynamic breadcrumbs
  const breadcrumbs = generateGigBreadcrumbs({
    title: gig.title,
    category: gig.category,
    subcategory: gig.subcategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Dynamic Breadcrumb Navigation */}
        <div className="mb-6">
          <DynamicBreadcrumb items={breadcrumbs} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {renderStars(gig.rating)}
                        <span className="font-medium ml-1">{gig.rating.toFixed(1)}</span>
                        <span>({gig._count.reviews} reviews)</span>
                      </div>
                      <span>•</span>
                      <span>{gig.category}</span>
                      {gig.subcategory && (
                        <>
                          <span>•</span>
                          <span>{gig.subcategory}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSave}
                      className={isSaved ? 'bg-red-50 border-red-200 text-red-600' : ''}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500' : ''}`} />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-100 rounded-t-lg">
                  <Image
                    src={gig.images[selectedImage] || '/assets/images/placeholder.png'}
                    alt={gig.title}
                    fill
                    priority
                    className="object-cover rounded-t-lg"
                  />
                </div>
                {gig.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {gig.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${gig.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About This Gig */}
            <Card>
              <CardHeader>
                <CardTitle>About This Gig</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{gig.description}</p>
              </CardContent>
            </Card>

            {/* About The Seller */}
            <Card>
              <CardHeader>
                <CardTitle>About The Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <Image
                    src={gig.seller.image || '/assets/images/default-avatar.png'}
                    alt={gig.seller.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{gig.seller.name}</h3>
                      {gig.seller.level && (
                        <Badge variant="secondary">{gig.seller.level}</Badge>
                      )}
                    </div>
                    {gig.seller.title && (
                      <p className="text-gray-600 mb-2">{gig.seller.title}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        {renderStars(gig.seller.rating)}
                        <span className="font-medium">{gig.seller.rating.toFixed(1)}</span>
                        <span>({gig.seller.reviewCount} reviews)</span>
                      </div>
                      <span>•</span>
                      <span>{gig.seller._count.gigs} gigs</span>
                    </div>
                    {gig.seller.description && (
                      <p className="text-gray-700 mb-3">{gig.seller.description}</p>
                    )}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Response Time</p>
                        <p className="font-medium">{gig.seller.responseTime || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Languages</p>
                        <p className="font-medium">{gig.seller.languages?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                    {gig.seller.skills && gig.seller.skills.length > 0 && (
                      <div className="mt-3">
                        <p className="text-gray-500 text-sm mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {gig.seller.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews ({gig._count.reviews})</CardTitle>
                  {gig.reviews.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                      {showAllReviews ? 'Show Less' : 'Show All'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {displayedReviews && displayedReviews.length > 0 ? (
                  <div className="space-y-4">
                    {displayedReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <Image
                            src={review.reviewer.image || '/assets/images/default-avatar.png'}
                            alt={review.reviewer.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.reviewer.name}</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{review.comment}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Packages Sidebar */}
          <div className="space-y-4">
            {/* Gig Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{gig._count.orders}</div>
                    <div className="text-sm text-gray-600">Orders Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{gig.seller.responseTime || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packages */}
            {gig.packages && gig.packages.length > 0 ? (
              gig.packages.map((pkg) => (
                <OrderButton
                  key={pkg.id}
                  package={pkg}
                  gigId={gig.id}
                  sellerId={gig.seller.id}
                  currentUserId={session?.user?.id}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center text-gray-500">
                  No packages available for this gig.
                </CardContent>
              </Card>
            )}

            {/* Contact Seller */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Have a question? Contact the seller directly.
                </p>
                <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Seller
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 