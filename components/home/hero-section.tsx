import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Shield, Clock, Search } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchQuery, setSearchQuery, handleSearch, handleKeyPress }) => (
  <section className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white py-20 lg:py-32 overflow-hidden">
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
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center max-w-4xl mx-auto">
        <Badge className="mb-6 bg-white/20 text-gray-900 border-white/30">
          <TrendingUp className="w-4 h-4 mr-2" />
          Trusted by 2M+ users worldwide
        </Badge>
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
          Find the perfect{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            freelance services
          </span>{' '}
          for your business
        </h1>
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="px-8 py-4 font-semibold rounded-lg shadow-lg"
          >
            Search
          </Button>
        </div>
        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Users className="w-4 h-4" />
            Trusted by 2M+ users
          </span>
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            Secure payments
          </span>
          <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            24/7 support
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection; 