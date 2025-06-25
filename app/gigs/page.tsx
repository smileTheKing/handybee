"use client"
import { useEffect, useState } from 'react'
import { GigList } from '@/components/gigs'
import { GigCardSkeleton } from '@/components/gigs/gig-card'
import type { Gig } from '@/components/gigs/gig-card'
import { DynamicBreadcrumb } from '@/components/ui/dynamic-breadcrumb'
import { useSearchParams } from 'next/navigation'

const PAGE_SIZE = 12

const sortOptions = [
  { value: 'best', label: 'Best selling' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'price-desc', label: 'Price (high to low)' },
]

export default function GigsPage() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('query') || ''
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sort, setSort] = useState('best')
  const [query, setQuery] = useState(urlQuery)
  const [proOnly, setProOnly] = useState(false)
  // Add more filter states as needed

  // Sync query state with URL param
  useEffect(() => {
    setQuery(urlQuery)
    // eslint-disable-next-line
  }, [urlQuery])

  useEffect(() => {
    setLoading(true)
    fetchGigs(1, true)
    // eslint-disable-next-line
  }, [sort, query, proOnly])

  const fetchGigs = async (pageNum: number, replace = false) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('limit', PAGE_SIZE.toString())
    params.set('offset', ((pageNum - 1) * PAGE_SIZE).toString())
    if (sort) params.set('sort', sort)
    if (query) params.set('query', query)
    if (proOnly) params.set('pro', '1')
    // Add more params for other filters
    const res = await fetch(`/api/gigs?${params.toString()}`)
    const data = await res.json()
    if (replace) {
      setGigs(data)
    } else {
      setGigs(prev => [...prev, ...data])
    }
    setHasMore(data.length === PAGE_SIZE)
    setLoading(false)
    setPage(pageNum)
  }

  const handleLoadMore = () => {
    fetchGigs(page + 1)
  }

  // Generate breadcrumbs for gigs listing
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Gigs', isCurrentPage: true }
  ]

  return (
    <div className="container mx-auto py-8">
      {/* Dynamic Breadcrumb */}
      <div className="mb-6">
        <DynamicBreadcrumb items={breadcrumbs} />
      </div>
      
      {/* Title & Subtitle */}
      <h1 className="text-4xl font-bold mb-2">All Gigs</h1>
      <p className="text-lg text-gray-600 mb-6">
        Discover amazing services from talented freelancers.
      </p>
      
      {/* Filter/Sort Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 border-b pb-4">
        <input
          type="text"
          placeholder="Search gigs..."
          className="border rounded px-4 py-2 bg-white focus:outline-primary"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="border rounded px-4 py-2 bg-white hover:bg-gray-50">Service options</button>
        <button className="border rounded px-4 py-2 bg-white hover:bg-gray-50">Seller details</button>
        <button className="border rounded px-4 py-2 bg-white hover:bg-gray-50">Budget</button>
        <button className="border rounded px-4 py-2 bg-white hover:bg-gray-50">Delivery time</button>
        <label className="flex items-center gap-2 ml-2">
          <input type="checkbox" className="accent-primary" checked={proOnly} onChange={e => setProOnly(e.target.checked)} /> Pro services
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span>Sort by:</span>
          <select
            className="border rounded px-2 py-1"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Result Count */}
      <div className="mb-4 text-gray-500">{loading && page === 1 ? '' : gigs.length + ' results'}</div>
      
      {/* Gig Grid with loading/empty states */}
      {loading && page === 1 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <GigCardSkeleton key={i} />
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg">
          No gigs found. Try adjusting your filters or check back later!
        </div>
      ) : (
        <>
          <GigList gigs={gigs} />
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 shadow"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
