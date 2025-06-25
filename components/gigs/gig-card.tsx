"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Eye } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Gig {
  id: string
  title: string
  images: string[]
  price?: number
  rating?: number
  reviewCount?: number
  seller?: {
    name?: string
    image?: string
    level?: string
  }
  sellerId?: string
  category?: string
  subcategory?: string
  _count?: {
    reviews: number
  }
}

interface GigCardProps {
  gig: Gig
  currentUserId?: string
}

export function GigCard({ gig, currentUserId }: GigCardProps) {
  const isOwner = currentUserId && gig.sellerId && currentUserId === gig.sellerId;
  const [deleting, setDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Delete handler
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this gig?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gigs/${gig.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete gig');
      alert('Gig deleted! Please refresh to see changes.');
    } catch {
      alert('Error deleting gig');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
  };

  return (
    <Link href={`/gigs/${gig.id}`}>
      <div className="group relative overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <Image
            src={gig.images?.[0] || '/assets/images/placeholder.png'}
            alt={gig.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.target as HTMLImageElement).src = '/assets/images/placeholder.png';
            }}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-start justify-between p-3">
            {/* Pro badge */}
            {gig.seller?.level === 'Pro' && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-xs font-bold">
                PRO
              </Badge>
            )}
            
            {/* Save button */}
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
              onClick={handleSave}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>

          {/* Category badge */}
          {gig.category && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="text-xs bg-white/90 text-gray-700">
                {gig.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className="font-semibold text-base md:text-lg line-clamp-2 mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
              {gig.title}
            </h3>
            
            {/* Seller info */}
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={gig.seller?.image || '/assets/images/default-avatar.png'}
                alt={gig.seller?.name || 'Seller'}
                width={24}
                height={24}
                className="rounded-full object-cover border w-6 h-6"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = '/assets/images/default-avatar.png';
                }}
              />
              <span className="text-sm text-gray-700 font-medium truncate">
                {gig.seller?.name || 'Unknown Seller'}
              </span>
            </div>
            
            {/* Rating and reviews */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800">
                  {gig.rating?.toFixed(1) ?? 'N/A'}
                </span>
                <span className="text-gray-500">
                  ({gig.reviewCount ?? gig._count?.reviews ?? 0})
                </span>
              </div>
            </div>
          </div>

          {/* Price and actions */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-green-600">
                {gig.price ? `From $${gig.price}` : 'Contact for price'}
              </span>
              
              {/* Owner actions */}
              {isOwner && (
                <div className="flex gap-1">
                  <Link href={`/gigs/${gig.id}/edit`} legacyBehavior>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded text-xs"
                  >
                    {deleting ? '...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>

            {/* View details button */}
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Loading skeleton for gig card
export function GigCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white shadow-sm animate-pulse flex flex-col h-full">
      <div className="relative aspect-video bg-gray-200" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
        </div>
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-9 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  )
} 