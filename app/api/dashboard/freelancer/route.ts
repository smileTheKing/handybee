import { NextResponse } from 'next/server'; // Fixed import: use default import
import { auth } from '@/app/config/auth'// Fixed import: use default import
import { prisma } from '@/prisma/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Stats
    const [gigCount, orderCount, reviewCount] = await Promise.all([
      prisma.gig.count({ where: { sellerId: userId } }),
      prisma.order.count({ where: { sellerId: userId } }),
      prisma.review.count({ where: { reviewedId: userId } }),
    ]);

    // Recent gigs
    const gigs = await prisma.gig.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        images: true,
        price: true,
        createdAt: true,
        sellerId: true,
      },
    });

    // Recent orders
    const orders = await prisma.order.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        gig: { select: { id: true, title: true, images: true } },
        package: { select: { name: true, price: true, deliveryTime: true } },
        buyer: { select: { name: true, image: true } },
        seller: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json({
      stats: {
        gigs: gigCount,
        orders: orderCount,
        reviews: reviewCount,
      },
      gigs,
      orders,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 