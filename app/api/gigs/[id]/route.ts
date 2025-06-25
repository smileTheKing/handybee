import { NextResponse } from 'next/server';

import { auth } from '@/app/config/auth';
import { prisma } from '@/prisma/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: gigId } = await params;
    
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true,
            title: true,
            description: true,
            responseTime: true,
            skills: true,
            languages: true,
            _count: {
              select: {
                gigs: true,
                receivedReviews: true,
              }
            }
          }
        },
        packages: {
          orderBy: {
            price: 'asc'
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      }
    });

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = gig.reviews.length > 0 
      ? gig.reviews.reduce((acc, review) => acc + review.rating, 0) / gig.reviews.length 
      : 0;

    // Calculate seller average rating
    const sellerReviews = await prisma.review.findMany({
      where: { reviewedId: gig.seller.id },
      select: { rating: true }
    });
    
    const sellerAvgRating = sellerReviews.length > 0 
      ? sellerReviews.reduce((acc, review) => acc + review.rating, 0) / sellerReviews.length 
      : 0;

    const formattedGig = {
      ...gig,
      rating: avgRating,
      seller: {
        ...gig.seller,
        rating: sellerAvgRating,
        reviewCount: sellerReviews.length
      }
    };

    return NextResponse.json(formattedGig);
  } catch (error) {
    console.error('Error fetching gig:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id: gigId } = await params;
    const data = await request.json();
    // Check ownership
    const gig = await prisma.gig.findUnique({ where: { id: gigId }, include: { packages: true } });
    if (!gig || gig.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Calculate minimum price from packages
    type PackageInput = {
      name: string;
      description: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      features: string[];
    };
    const minPrice = Array.isArray(data.packages) && data.packages.length > 0
      ? Math.min(...(data.packages as PackageInput[]).map((pkg) => Number(pkg.price)))
      : gig.price;
    // Update gig main fields
    const updatedGig = await prisma.gig.update({
      where: { id: gigId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        price: minPrice,
      },
    });
    // Update packages: delete old, create new
    if (Array.isArray(data.packages)) {
      // Delete old packages
      await prisma.package.deleteMany({ where: { gigId } });
      // Create new packages
      for (const pkg of data.packages as PackageInput[]) {
        await prisma.package.create({
          data: {
            name: pkg.name,
            description: pkg.description,
            price: Number(pkg.price),
            deliveryTime: Number(pkg.deliveryTime),
            revisions: Number(pkg.revisions),
            features: pkg.features,
            gigId,
          },
        });
      }
    }
    return NextResponse.json(updatedGig);
  } catch (error) {
    console.error('Error updating gig:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id: gigId } = await params;
    // Check ownership
    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig || gig.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.gig.delete({ where: { id: gigId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gig:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 