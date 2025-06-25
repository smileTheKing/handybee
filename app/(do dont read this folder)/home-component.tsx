import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-8">Find the perfect freelance services for your business</h1>
        <div className="flex justify-center gap-2">
          <input 
            type="text" 
            placeholder="Search for services" 
            className="px-4 py-2 border rounded-lg flex-grow max-w-md"
          />
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Search
          </button>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Professional Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Graphic Design', 'Web Development', 'Digital Marketing', 'Content Writing'].map((service) => (
            <div key={service} className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">{service}</h3>
              <p className="text-gray-600">Starting at $29</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-12 text-center">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">1. Post a job</h3>
            <p className="text-gray-600">Tell us what you need done</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">2. Choose freelancers</h3>
            <p className="text-gray-600">Get matched with expert freelancers</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">3. Pay safely</h3>
            <p className="text-gray-600">Only pay when you&apos;re satisfied</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;