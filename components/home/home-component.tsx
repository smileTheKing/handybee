"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Award, Zap, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/home/hero-section';
import Footer from '../layout/footer';

interface PopularGig {
  id: string;
  title: string;
  images: string[];
  price: number;
  rating: number;
  reviewCount: number;
  seller: {
    name: string;
    image: string;
    level?: string;
  };
  category: string;
}

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularGigs, setPopularGigs] = useState<PopularGig[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch popular gigs
  useEffect(() => {
    const fetchPopularGigs = async () => {
      try {
        const response = await fetch('/api/gigs?limit=8&sort=best');
        if (response.ok) {
          const data = await response.json();
          setPopularGigs(data);
        }
      } catch (error) {
        console.error('Error fetching popular gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularGigs();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/gigs?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const categories = [
    { name: 'Graphics & Design', icon: '🎨', href: '/gigs?category=Design' },
    { name: 'Digital Marketing', icon: '📈', href: '/gigs?category=Marketing' },
    { name: 'Writing & Translation', icon: '✍️', href: '/gigs?category=Writing' },
    { name: 'Video & Animation', icon: '🎬', href: '/gigs?category=Video' },
    { name: 'Music & Audio', icon: '🎵', href: '/gigs?category=Music' },
    { name: 'Programming', icon: '💻', href: '/gigs?category=Programming' },
    { name: 'Business', icon: '💼', href: '/gigs?category=Business' },
    { name: 'Lifestyle', icon: '🌟', href: '/gigs?category=Lifestyle' },
  ];

  const stats = [
    { number: '2M+', label: 'Active Users', icon: Users },
    { number: '500K+', label: 'Completed Projects', icon: Award },
    { number: '99%', label: 'Satisfaction Rate', icon: Star },
    { number: '24/7', label: 'Support Available', icon: Clock },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Startup Founder',
      content: 'HandleBee helped me find the perfect developer for my app. The quality was outstanding!',
      rating: 5,
      image: '/assets/images/default-avatar.png'
    },
    {
      name: 'Mike Chen',
      role: 'Marketing Director',
      content: 'The designers I found here transformed our brand completely. Highly recommended!',
      rating: 5,
      image: '/assets/images/default-avatar.png'
    },
    {
      name: 'Emma Davis',
      role: 'Content Creator',
      content: 'Fast, reliable, and professional. HandleBee is my go-to for all freelance needs.',
      rating: 5,
      image: '/assets/images/default-avatar.png'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore Popular Categories</h2>
            <p className="text-gray-600 text-lg">Find the perfect service for your needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trending Services</h2>
            <p className="text-gray-600 text-lg">Discover what&apos;s popular right now</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularGigs.map((gig) => (
                <Link key={gig.id} href={`/gigs/${gig.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                          <Image
                            src={gig.images?.[0] || '/assets/images/placeholder.png'}
                            alt={gig.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {gig.seller.level === 'Pro' && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900">
                            PRO
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{gig.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Image
                            src={gig.seller.image || '/assets/images/default-avatar.png'}
                            alt={gig.seller.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-600">{gig.seller.name}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {gig.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Starting at <span className="font-bold text-green-600">${gig.price}</span>
                        </p>
                        <p className="text-gray-500 text-xs">
                          {gig.reviewCount} reviews
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/gigs">
              <Button variant="outline" size="lg" className="px-8">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How HandleBee Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to get your project done</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Post a job</h3>
              <p className="text-gray-600 leading-relaxed">Tell us what you need done. It&apos;s free to post and you&apos;ll get quotes from talented freelancers within minutes.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Choose freelancers</h3>
              <p className="text-gray-600 leading-relaxed">Browse profiles, reviews, and portfolios. Chat with freelancers and hire the best one for your project.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pay safely</h3>
              <p className="text-gray-600 leading-relaxed">Only pay when you&apos;re satisfied. Your payment is held securely until you approve the work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 text-lg">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/30">
          <Image
            src="/assets/images/hero1.webp"
            alt="Hero background"
            fill
            className="object-cover opacity-30"
          />
        </div>
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gray-400/30 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-700/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-700/20 rounded-full blur-xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Join millions of people who trust HandleBee for their freelance needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {session ? (
              <Link href="/gigs/add">
                <Button className="px-8 py-4 font-semibold rounded-lg shadow-lg" size="lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Create a Gig
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button className="px-8 py-4 font-semibold rounded-lg shadow-lg" size="lg">
                  Get Started Free
                </Button>
              </Link>
            )}
            <Link href="/gigs">
              <Button className="px-8 py-4 border-2 border-white font-semibold rounded-lg" variant="outline" size="lg">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/**footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;