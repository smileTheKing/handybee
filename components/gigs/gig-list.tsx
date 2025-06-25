import { GigCard } from './gig-card'

interface Gig {
  id: string
  title: string
  images: string[]
  sellerId?: string
  _count?: {
    reviews: number
  }
}

interface GigListProps {
  gigs: Gig[]
  currentUserId?: string
}

export function GigList({ gigs, currentUserId }: GigListProps) {
  if (gigs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No gigs found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gigs.map((gig) => (
        <GigCard key={gig.id} gig={gig} currentUserId={currentUserId} />
      ))}
    </div>
  )
} 