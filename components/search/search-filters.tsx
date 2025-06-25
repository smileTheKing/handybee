import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void
}

export interface SearchFilters {
  category: string
  minPrice: number
  maxPrice: number
  rating: number
}

const categories = [
  'All Categories',
  'Design',
  'Development',
  'Writing',
  'Marketing',
  'Video & Animation',
  'Music & Audio',
  'Business',
  'Lifestyle',
]

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Omit<SearchFilters, 'query'>>({
    category: 'All Categories',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
  })

  const handleChange = (key: keyof Omit<SearchFilters, 'query'>, value: string | number) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters as SearchFilters)
  }

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/*
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <Input
            placeholder="Search gigs..."
            value={filters.query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('query', e.target.value)}
          />
        </div>
        */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value: string) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={filters.minPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('minPrice', Number(e.target.value))}
              className="w-24"
            />
            <span>-</span>
            <Input
              type="number"
              value={filters.maxPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxPrice', Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Rating</label>
          <Slider
            value={[filters.rating]}
            onValueChange={(value: number[]) => handleChange('rating', value[0])}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="text-sm text-gray-500">{filters.rating} stars</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({
              category: 'All Categories',
              minPrice: 0,
              maxPrice: 1000,
              rating: 0,
            })
            onFilterChange({
              category: 'All Categories',
              minPrice: 0,
              maxPrice: 1000,
              rating: 0,
            } as SearchFilters)
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
} 