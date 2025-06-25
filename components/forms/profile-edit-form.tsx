"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

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

interface ProfileEditFormProps {
  initialData: ProfileData
  onSave: (data: ProfileData) => Promise<void>
}

const defaultProfileData: ProfileData = {
  name: '',
  title: '',
  description: '',
  hourlyRate: 0,
  level: '',
  responseTime: '',
  skills: [],
  languages: [],
};

export function ProfileEditForm({ initialData, onSave }: ProfileEditFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileData>({
    ...defaultProfileData,
    ...initialData,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')

  const handleInputChange = (field: keyof ProfileData, value: string | number | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      handleInputChange('skills', [...formData.skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills.filter(skill => skill !== skillToRemove))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      handleInputChange('languages', [...formData.languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    handleInputChange('languages', formData.languages.filter(lang => lang !== languageToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(formData)
      router.push('/profile')
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Senior Web Developer, Creative Designer"
            />
          </div>
          
          <div>
            <Label htmlFor="description">About Me</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell potential clients about your experience, expertise, and what makes you unique..."
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate || ''}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g., 25.00"
            />
          </div>
          
          <div>
            <Label htmlFor="level">Experience Level</Label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="responseTime">Response Time</Label>
            <select
              id="responseTime"
              value={formData.responseTime}
              onChange={(e) => handleInputChange('responseTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select response time</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="4 hours">4 hours</option>
              <option value="8 hours">8 hours</option>
              <option value="1 day">1 day</option>
              <option value="2 days">2 days</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language"
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            />
            <Button type="button" onClick={addLanguage} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((language, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(language)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/profile')}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 