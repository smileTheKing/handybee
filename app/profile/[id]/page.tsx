import { prisma } from '@/prisma/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { GigList } from '@/components/gigs'
import { ReviewList } from '@/components/reviews'
import { Star, Calendar, Clock, DollarSign, Award } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/app/config/auth'
import { Button } from '@/components/ui/button'

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
      title: true,
      hourlyRate: true,
      level: true,
      responseTime: true,
      skills: true,
      languages: true,
      createdAt: true,
      _count: {
        select: {
          gigs: true,
          reviews: true,
          orders: true,
        },
      },
      gigs: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { reviews: true } },
        },
      },
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          gig: { select: { id: true, title: true, images: true } },
          reviewer: { select: { name: true, image: true } },
        },
      },
    },
  })

  if (!user) notFound()

  const averageRating = user.reviews.length > 0
    ? user.reviews.reduce((acc, review) => acc + review.rating, 0) / user.reviews.length
    : 0

  const isOwner = session?.user?.id === user.id

  return (
    <div className="container mx-auto py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src={user.image || '/assets/images/default-avatar.png'}
              alt={user.name || 'Profile'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.title && <p className="mt-1 text-lg text-gray-600">{user.title}</p>}
            <p className="mt-2 text-gray-600">{user.description || 'No description yet'}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>{averageRating.toFixed(1)} ({user.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {isOwner && (
            <Button variant="outline" asChild>
              <a href="/profile/edit">Edit Profile</a>
            </Button>
          )}
        </div>
      </div>

      {/* Professional Details */}
      {(user.level || user.hourlyRate || user.responseTime) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.level && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Experience Level</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{user.level}</p>
            </Card>
          )}
          {user.hourlyRate && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Hourly Rate</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">${user.hourlyRate}/hr</p>
            </Card>
          )}
          {user.responseTime && (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Response Time</h3>
              </div>
              <p className="mt-2 text-2xl font-bold">{user.responseTime}</p>
            </Card>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Active Gigs</h3>
          <p className="mt-2 text-3xl font-bold">{user._count.gigs}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold">{user._count.orders}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Reviews Received</h3>
          <p className="mt-2 text-3xl font-bold">{user._count.reviews}</p>
        </Card>
      </div>

      {/* Skills and Languages */}
      {(user.skills?.length > 0 || user.languages?.length > 0) && (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {user.skills?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {user.languages?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((language, index) => (
                    <Badge key={index} variant="outline">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="gigs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gigs">Gigs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="gigs">
          <GigList gigs={user.gigs} />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewList reviews={user.reviews} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 