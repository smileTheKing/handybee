"use client"
import Link from 'next/link'
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function DynamicBreadcrumb({ items, className }: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{item.label}</span>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Helper function to generate breadcrumbs for gigs
export function generateGigBreadcrumbs(gig: {
  title: string
  category: string
  subcategory?: string
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Gigs', href: '/gigs' },
    { label: gig.category, href: `/gigs?category=${encodeURIComponent(gig.category)}` }
  ]

  if (gig.subcategory) {
    breadcrumbs.push({
      label: gig.subcategory,
      href: `/gigs?category=${encodeURIComponent(gig.category)}&subcategory=${encodeURIComponent(gig.subcategory)}`
    })
  }

  breadcrumbs.push({
    label: gig.title,
    isCurrentPage: true
  })

  return breadcrumbs
}

// Helper function to generate breadcrumbs for profile pages
export function generateProfileBreadcrumbs(userName: string, isCurrentUser: boolean = false) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/profiles' }
  ]

  if (isCurrentUser) {
    breadcrumbs.push({ label: 'My Profile', href: '/profile' })
  } else {
    breadcrumbs.push({ label: userName, isCurrentPage: true })
  }

  return breadcrumbs
}

// Helper function to generate breadcrumbs for orders
export function generateOrderBreadcrumbs(orderId?: string) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Orders', href: '/orders' }
  ]

  if (orderId) {
    breadcrumbs.push({ label: `Order #${orderId}`, isCurrentPage: true })
  }

  return breadcrumbs
}

// Helper function to generate breadcrumbs for dashboard
export function generateDashboardBreadcrumbs(section?: string) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' }
  ]

  if (section) {
    breadcrumbs.push({ label: section, isCurrentPage: true })
  }

  return breadcrumbs
}

// Helper function to generate breadcrumbs for gig creation/editing
export function generateGigFormBreadcrumbs(isEditing: boolean = false, gigTitle?: string) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Gigs', href: '/gigs' }
  ]

  if (isEditing && gigTitle) {
    breadcrumbs.push({ label: gigTitle, href: `/gigs/${gigTitle}` })
    breadcrumbs.push({ label: 'Edit', isCurrentPage: true })
  } else {
    breadcrumbs.push({ label: 'Create New Gig', isCurrentPage: true })
  }

  return breadcrumbs
} 