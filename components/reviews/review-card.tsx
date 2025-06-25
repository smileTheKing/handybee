import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  gig: {
    title: string
    images: string[]
  }
  reviewer: {
    name: string | null
    image: string | null
  }
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            src={review.reviewer.image || '/assets/images/default-avatar.png'}
            alt={review.reviewer.name || 'Reviewer'}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{review.reviewer.name}</h3>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {review.comment && (
            <p className="mt-2 text-gray-600">{review.comment}</p>
          )}
          <Link
            href={`/gigs/${review.gig.id}`}
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <div className="relative h-8 w-12 overflow-hidden rounded">
              <Image
                src={review.gig.images[0] || '/assets/images/placeholder.png'}
                alt={review.gig.title}
                fill
                className="object-cover"
              />
            </div>
            <span>{review.gig.title}</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 