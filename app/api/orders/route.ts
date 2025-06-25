import { NextResponse } from 'next/server';
import { auth } from '@/app/config/auth';
import { prisma } from '@/prisma/prisma';

// POST - Create a new order
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gigId, packageId, total } = await request.json();

    if (!gigId || !packageId || !total) {
      return NextResponse.json({ 
        error: 'Gig ID, package ID, and total are required' 
      }, { status: 400 });
    }

    // Verify the gig exists and is published
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: { seller: true }
    });

    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    if (!gig.published) {
      return NextResponse.json({ error: 'Gig is not available' }, { status: 400 });
    }

    // Verify the package exists and belongs to the gig
    const package_ = await prisma.package.findUnique({
      where: { id: packageId }
    });

    if (!package_) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (package_.gigId !== gigId) {
      return NextResponse.json({ error: 'Package does not belong to this gig' }, { status: 400 });
    }

    // Prevent users from ordering their own gig
    if (gig.sellerId === session.user.id) {
      return NextResponse.json({ error: 'You cannot order your own gig' }, { status: 400 });
    }

    // Ensure user ID exists
    if (!session.user.id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        sellerId: gig.sellerId,
        gigId,
        packageId,
        total,
        status: 'PENDING'
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        gig: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
        package: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET - Fetch user orders
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'buying' or 'selling'

    let whereClause = {};
    
    if (type === 'selling') {
      whereClause = { sellerId: session.user.id };
    } else {
      whereClause = { buyerId: session.user.id };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        gig: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
        package: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 