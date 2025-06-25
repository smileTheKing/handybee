"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DynamicBreadcrumb, generateProfileBreadcrumbs } from '@/components/ui/dynamic-breadcrumb'
import { ProfileEditForm } from '@/components/forms/profile-edit-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

interface ProfileData {
  name: string
  title: string
  description: string
  hourlyRate: number | null
  level: string
  responseTime: string
  skills: string[]
  languages: string[]
}

export default function ProfileEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate breadcrumbs for profile edit page
  const breadcrumbs = generateProfileBreadcrumbs(session?.user?.name || 'Profile', true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/login')
      return
    }

    fetchProfileData()
  }, [session, status, router])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile data')
      }
      
      const data = await response.json()
      setProfileData({
        name: data.user.name || '',
        title: data.user.title || '',
        description: data.user.description || '',
        hourlyRate: data.user.hourlyRate,
        level: data.user.level || '',
        responseTime: data.user.responseTime || '',
        skills: data.user.skills || [],
        languages: data.user.languages || [],
      })
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Error fetching profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: ProfileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      // Refresh session to get updated user data
      window.location.reload()
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
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
          <p className="text-gray-600">You need to be signed in to edit your profile.</p>
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

  if (!profileData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <p className="text-gray-600">Unable to load profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Dynamic Breadcrumb */}
      <div className="mb-6">
        <DynamicBreadcrumb items={breadcrumbs} />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileEditForm 
              initialData={profileData} 
              onSave={handleSave} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 