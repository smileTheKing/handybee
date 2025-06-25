import { SiteHeader } from '@/components/layout'
import { SidebarProvider } from '@/components/ui/sidebar'
import Link from 'next/link'

import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
          {/* <HomeAppSideBar/> */}
    <main className="flex flex-col h-screen w-full ">
        <SiteHeader/>
       
        <div className="p-6">
          <Breadcrumb />
            {children}
        </div>
      </main>
    </SidebarProvider>
 
   )
    
}

// Breadcrumb component
const Breadcrumb = () => {
  return (
    <nav className="flex py-3 text-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="/home" className="text-sm font-medium text-gray-700 hover:text-blue-600">
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/home/gig-listing" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Gig Listing
            </Link>
          </div>
        </li>
      </ol>
    </nav>
  )
}