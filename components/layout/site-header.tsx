"use client"
import { Button } from "@/components/ui/button"
import { ChatNotification } from "@/components/chat"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Input } from "../ui/input"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const { data: session } = useSession()
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/gigs?query=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        {/* Left section: Logo and Sidebar trigger */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image
              width={60}
              height={60}
              src={"/assets/images/bee.png"}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Center section: Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <Input
            placeholder="What service are you looking for today?"
            className=" p-4 h-11"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button className="ml-2" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Right section: Navigation */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/gigs">Explore</Link>
            </Button>
            {session?.user ? (
              <>
                <ChatNotification />
                {/* Only show Dashboard for SELLER or ADMIN */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {['SELLER', 'ADMIN'].includes(((session.user as any).role)) && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">Profile</Link>
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </nav>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Image
                    src={session.user.image || "/assets/images/default-avatar.png"}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/signup">Join</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
