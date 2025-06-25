"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { OrderList } from '@/components/orders/order-list';
import { GigList } from '@/components/gigs/gig-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';
import type { Gig } from '@/components/gigs/gig-card';
import {
  Home,
  Briefcase,
  ShoppingCart,
  BarChart2,
  Users,
  ShieldCheck,
  FileWarning,
  Star,
  MessageCircle,
  PlusCircle,
  Inbox
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

type DashboardStats = {
  gigs: number;
  orders: number;
  reviews: number;
  earnings?: number;
};

// Local Order type (matches components/orders/order-list.tsx)
type Order = {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  total: number;
  createdAt: string;
  gig: {
    title: string;
    images: string[];
  };
  package: {
    name: string;
    price: number;
    deliveryTime: number;
  };
  buyer: {
    name: string | null;
    image: string | null;
  };
  seller: {
    name: string | null;
    image: string | null;
  };
};

type DashboardData = {
  stats: DashboardStats;
  gigs: Gig[];
  orders: Order[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine user role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;
  const isSeller = role === 'SELLER' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    if (status !== 'loading') {
      if (!session?.user || (!isSeller && !isAdmin)) {
        setError('You do not have permission to access the dashboard.');
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    setError(null);
    fetch('/api/dashboard/freelancer')
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to load dashboard');
        const data = await res.json();
        setDashboard({
          stats: data.stats,
          gigs: data.gigs as Gig[],
          orders: data.orders as Order[],
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [session, status]);

  // Sidebar nav items (role-based)
  const sidebarNav: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[] = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    ...(isSeller ? [
      { title: 'Gigs', url: '/gigs', icon: Briefcase },
      { title: 'Orders', url: '/orders', icon: ShoppingCart },
      { title: 'Analytics', url: '/dashboard?tab=analytics', icon: BarChart2 },
    ] : []),
    ...(isAdmin ? [
      { title: 'User Management', url: '/dashboard?tab=users', icon: Users },
      { title: 'Gig Moderation', url: '/dashboard?tab=gigs', icon: ShieldCheck },
      { title: 'Reports', url: '/dashboard?tab=reports', icon: FileWarning },
    ] : []),
  ];

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-gray-50f">
        {/* Sidebar */}
        <div className="w-64 border-r bg-white">
          <AppSidebar navItems={sidebarNav} /> *
        </div>
        {/* Main content */}
        <main className="flex-1 p-8">
          {/* Welcome Banner */}
          <div className="mb-8 flex items-center gap-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/30 rounded-xl z-0"></div>
            <Image width={500} height={500} src="/assets/images/bee.png" alt="Bee" className="w-12 h-12 rounded-full border border-yellow-300 bg-white relative z-10" />
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!</h1>
              <p className="text-gray-200">Here&apos;s your freelance dashboard overview.</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-6 bg-amber-400">Dashboard</h2>
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          )}
          {error && <Alert variant="destructive" className="mb-6"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {!loading && !error && (
            <Tabs defaultValue={isSeller ? 'seller-analytics' : 'admin-analytics'} className="w-full">
              <TabsList className="mb-6">
                {isSeller && <TabsTrigger value="seller-analytics"><BarChart2 className="w-4 h-4 mr-2" />Analytics</TabsTrigger>}
                {isSeller && <TabsTrigger value="orders"><ShoppingCart className="w-4 h-4 mr-2" />Orders</TabsTrigger>}
                {isSeller && <TabsTrigger value="gigs"><Briefcase className="w-4 h-4 mr-2" />Gigs</TabsTrigger>}
                {isAdmin && <TabsTrigger value="admin-analytics"><BarChart2 className="w-4 h-4 mr-2" />Platform Analytics</TabsTrigger>}
                {isAdmin && <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />User Management</TabsTrigger>}
                {isAdmin && <TabsTrigger value="moderation"><ShieldCheck className="w-4 h-4 mr-2" />Gig Moderation</TabsTrigger>}
                {isAdmin && <TabsTrigger value="reports"><FileWarning className="w-4 h-4 mr-2" />Reports</TabsTrigger>}
              </TabsList>
              {/* Seller Analytics */}
              {isSeller && (
                <TabsContent value="seller-analytics">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card className="shadow-md border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2"><Briefcase className="w-6 h-6 text-yellow-500" /><CardTitle>Active Gigs</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold text-yellow-900">{dashboard?.stats.gigs ?? 0}</span></CardContent>
                    </Card>
                    <Card className="shadow-md border-0 bg-gradient-to-br from-green-50 to-green-100">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2"><ShoppingCart className="w-6 h-6 text-green-500" /><CardTitle>Total Orders</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold text-green-900">{dashboard?.stats.orders ?? 0}</span></CardContent>
                    </Card>
                    <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2"><Star className="w-6 h-6 text-blue-500" /><CardTitle>Reviews</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold text-blue-900">{dashboard?.stats.reviews ?? 0}</span></CardContent>
                    </Card>
                  </div>
                  <div className="mb-8">
                    <Card className="shadow-sm border-0">
                      <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                      <CardContent className="flex gap-4 flex-wrap">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="outline"><Link href="/gigs/add"><PlusCircle className="w-4 h-4 mr-2" />Create New Gig</Link></Button>
                          </TooltipTrigger>
                          <TooltipContent>Add a new gig to your portfolio</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="outline"><Link href="/orders"><ShoppingCart className="w-4 h-4 mr-2" />View Orders</Link></Button>
                          </TooltipTrigger>
                          <TooltipContent>See all your orders</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="outline"><Link href="/chat"><MessageCircle className="w-4 h-4 mr-2" />Messages</Link></Button>
                          </TooltipTrigger>
                          <TooltipContent>Check your messages</TooltipContent>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
              {/* Seller Orders */}
              {isSeller && (
                <TabsContent value="orders">
                  <Card className="shadow-sm border-0">
                    <CardHeader><CardTitle>Order Management</CardTitle></CardHeader>
                    <CardContent>
                      <div className="mt-4">
                        {dashboard?.orders && dashboard.orders.length > 0 ? (
                          <OrderList orders={dashboard.orders} userId={session?.user?.id || ''} />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400 py-8">
                            <Inbox className="w-12 h-12 mb-2" />
                            <span>No orders found.</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {/* Seller Gigs */}
              {isSeller && (
                <TabsContent value="gigs">
                  <Card className="shadow-sm border-0">
                    <CardHeader><CardTitle>Gig Management</CardTitle></CardHeader>
                    <CardContent>
                      <div className="mt-4">
                        {dashboard?.gigs && dashboard.gigs.length > 0 ? (
                          <GigList gigs={dashboard.gigs} currentUserId={session?.user?.id || ''} />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400 py-8">
                            <Briefcase className="w-12 h-12 mb-2" />
                            <span>No gigs found.</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {/* Admin Analytics */}
              {isAdmin && (
                <TabsContent value="admin-analytics">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                      <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold">$0</span></CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold">0</span></CardContent>
                    </Card>
                    <Card>
                      <CardHeader><CardTitle>Top Sellers</CardTitle></CardHeader>
                      <CardContent><span className="text-3xl font-bold">-</span></CardContent>
                    </Card>
                    {/* Add more admin analytics cards here */}
                  </div>
                </TabsContent>
              )}
              {/* Admin User Management */}
              {isAdmin && (
                <TabsContent value="users">
                  <Card>
                    <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
                    <CardContent>
                      {/* TODO: Implement user management table */}
                      <div className="text-gray-500">User management coming soon.</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {/* Admin Gig Moderation */}
              {isAdmin && (
                <TabsContent value="moderation">
                  <Card>
                    <CardHeader><CardTitle>Gig Moderation</CardTitle></CardHeader>
                    <CardContent>
                      {/* TODO: Implement gig moderation table */}
                      <div className="text-gray-500">Gig moderation coming soon.</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              {/* Admin Reports */}
              {isAdmin && (
                <TabsContent value="reports">
                  <Card>
                    <CardHeader><CardTitle>Reports & Feedback</CardTitle></CardHeader>
                    <CardContent>
                      {/* TODO: Implement reports/feedback list */}
                      <div className="text-gray-500">Reports and feedback coming soon.</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
