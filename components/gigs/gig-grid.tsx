import { GigCard, type Gig, GigCardSkeleton } from './gig-card'

interface GigGridProps {
  gigs: Gig[]
  currentUserId?: string
  loading?: boolean
}

export function GigGrid({ gigs, currentUserId, loading = false }: GigGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <GigCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or browse all gigs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {gigs.map((gig) => (
        <GigCard key={gig.id} gig={gig} currentUserId={currentUserId} />
      ))}
    </div>
  )
} 