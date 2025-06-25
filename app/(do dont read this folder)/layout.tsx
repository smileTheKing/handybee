import React from 'react'
export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
 
    <main className="flex flex-col h-screen w-full ">
        <div className="p-6">
            {children}
        </div>
      </main>
   )
    
}
