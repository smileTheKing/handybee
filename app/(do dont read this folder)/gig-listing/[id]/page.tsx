import React from 'react'

export default function GigDetailsPage() {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* leftside of the page */}
        <div className="md:col-span-2 space-y-6">
            <div className="text-3xl font-bold">
                Professional Web Development Services
            </div>
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">Professional Developer</p>
                </div>
            </div>
            <div className="aspect-video w-full bg-gray-100 rounded-lg"></div>
            <div className="prose max-w-none">
                <h3>About This Gig</h3>
                <p className="text-gray-600">
                    Detailed description of the service offering, including key features,
                    deliverables, and what makes this gig unique.
                </p>
            </div>
        </div>
      
        {/* right side of the page */}
        <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
            <h1 className='text-2xl font-bold mb-4'>Gig Details for job</h1>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span>Basic Package</span>
                    <span className="font-bold">$99</span>
                </div>
                <p className='text-gray-600'>Delivery Time: 3 days</p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Continue ($99)
                </button>
            </div>
        </div>
    </div>
  )
}
