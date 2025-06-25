//import { SiteHeader } from '@/components/layout'
import React from 'react'
import { Footer } from "@/components/layout";

export default function layout({children}:Readonly<{
    children:React.ReactNode
}>) {
  return (
    <div>
        {/* <SiteHeader /> */}
        {children}
        <Footer />
    </div>
  )
}
