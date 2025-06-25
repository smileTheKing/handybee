import { SiteHeader } from '@/components/layout'
import React from 'react'
import { Footer } from "@/components/layout";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="flex flex-col min-h-screen">
    <SiteHeader />
    <main className="flex-1">
      {children}
      <Footer />
    </main>
  </div>
  )
}
