"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DynamicBreadcrumb, generateProfileBreadcrumbs } from '@/components/ui/dynamic-breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Edit, ExternalLink, Plus, ShoppingCart, MessageSquare, Settings } from 'lucide-react'
import Image from 'next/image'

interface ProfileStats {
  activeGigs: number
  completedOrders: number
  totalReviews: number
  totalEarnings: number
}

interface ProfileData {
  name: string
  email: string
  image: string
  title: string
  description: string
  hourlyRate: number | null
  level: string
  responseTime: string
  skills: string[]
  languages: string[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate breadcrumbs for profile page
  const breadcrumbs = generateProfileBreadcrumbs(session?.user?.name || 'Profile', true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      return
    }

    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile data')
      }
      
      const data = await response.json()
      setProfileData(data.user)
      setStats(data.stats)
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error fetching profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Helper to safely access profileData fields
  const safeProfileData = profileData ?? {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    image: session.user.image ?? '/assets/images/default-avatar.png',
    title: '',
    description: '',
    hourlyRate: null,
    level: '',
    responseTime: '',
    skills: [],
    languages: [],
  }

  return (
    <div className="container mx-auto py-8">
      {/* Dynamic Breadcrumb */}
      <div className="mb-6">
        <DynamicBreadcrumb items={breadcrumbs} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Image
                  src={safeProfileData.image || '/assets/images/default-avatar.png'}
                  alt={safeProfileData.name || 'Profile'}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{safeProfileData.name}</h2>
                  <p className="text-gray-600 mb-2">{safeProfileData.email}</p>
                  {safeProfileData.title && (
                    <p className="text-gray-700 mb-2 font-medium">{safeProfileData.title}</p>
                  )}
                  {safeProfileData.description && (
                    <p className="text-gray-600 mb-4 text-sm">{safeProfileData.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => router.push('/profile/edit')}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (session.user && 'id' in session.user && session.user.id) {
                          router.push(`/profile/${session.user.id}`)
                        }
                      }}
                      disabled={!session.user || !('id' in session.user) || !session.user.id}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Public Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          {(safeProfileData.level || safeProfileData.hourlyRate || safeProfileData.responseTime) && (
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {safeProfileData.level && (
                    <div>
                      <h4 className="font-medium text-gray-700">Experience Level</h4>
                      <p className="text-gray-600">{safeProfileData.level}</p>
                    </div>
                  )}
                  {safeProfileData.hourlyRate !== null && safeProfileData.hourlyRate !== undefined && (
                    <div>
                      <h4 className="font-medium text-gray-700">Hourly Rate</h4>
                      <p className="text-gray-600">${safeProfileData.hourlyRate}/hr</p>
                    </div>
                  )}
                  {safeProfileData.responseTime && (
                    <div>
                      <h4 className="font-medium text-gray-700">Response Time</h4>
                      <p className="text-gray-600">{safeProfileData.responseTime}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills and Languages */}
          {((Array.isArray(safeProfileData.skills) && safeProfileData.skills.length > 0) ||
            (Array.isArray(safeProfileData.languages) && safeProfileData.languages.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.isArray(safeProfileData.skills) && safeProfileData.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {safeProfileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(safeProfileData.languages) && safeProfileData.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {safeProfileData.languages.map((language, index) => (
                        <Badge key={index} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats?.activeGigs ?? 0}</div>
                  <div className="text-sm text-gray-600">Active Gigs</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats?.completedOrders ?? 0}</div>
                  <div className="text-sm text-gray-600">Completed Orders</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats?.totalReviews ?? 0}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">${stats?.totalEarnings ?? 0}</div>
                  <div className="text-sm text-gray-600">Earnings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => router.push('/gigs/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Gig
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push('/orders')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push('/chat')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{safeProfileData.level || 'Basic'}</Badge>
                <span className="text-sm text-gray-600">Account Level</span>
              </div>
              <p className="text-sm text-gray-600">
                {safeProfileData.level === 'Expert' 
                  ? 'You have the highest level account with all features unlocked.'
                  : 'Upgrade to Pro to unlock more features and increase your visibility.'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 