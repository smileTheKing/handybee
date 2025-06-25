import { NextResponse } from 'next/server'
import { auth } from '@/app/config/auth'
import { prisma } from '@/prisma/prisma'

// Prisma QueryMode type for strict typing
import type { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const sort = searchParams.get('sort') || 'best'
    const pro = searchParams.get('pro') === '1'
    const minDelivery = searchParams.get('minDelivery')
    const maxDelivery = searchParams.get('maxDelivery')

    // Build the where clause with correct Prisma types
    const where: Prisma.GigWhereInput = {
      published: true,
      ...(category && category !== 'All Categories' ? { category } : {}),
      ...(minPrice ? { price: { gte: parseFloat(minPrice) } } : {}),
      ...(maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
              { description: { contains: query, mode: 'insensitive' as Prisma.QueryMode } },
            ],
          }
        : {}),
      ...(pro ? { seller: { level: 'Pro' } } : {}),
    }

    // Sorting logic
    let orderBy: Prisma.GigOrderByWithRelationInput = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'newest') orderBy = { createdAt: 'desc' }
    // 'best' can be by rating or sales, but fallback to createdAt

    const gigs = await prisma.gig.findMany({
      where,
      include: {
        seller: {
          select: {
            name: true,
            image: true,
            level: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        packages: {
          select: {
            price: true,
            deliveryTime: true,
          },
          orderBy: {
            price: 'asc',
          },
          take: 1,
        },
      },
      orderBy,
      skip: offset,
      take: limit,
    })

    // Calculate average rating and format the response
    let formattedGigs = gigs.map(gig => {
      const reviews = gig.reviews ?? []
      const packages = gig.packages ?? []
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / reviews.length
          : 0
      return {
        ...gig,
        rating: avgRating,
        reviewCount: reviews.length,
        price: packages[0]?.price ?? gig.price,
        deliveryTime: packages[0]?.deliveryTime ?? null,
      }
    })

    // Filter by rating if specified
    if (rating) {
      formattedGigs = formattedGigs.filter(gig => gig.rating >= parseFloat(rating))
    }
    // Filter by delivery time if specified
    if (minDelivery) {
      formattedGigs = formattedGigs.filter(gig => gig.deliveryTime && gig.deliveryTime >= parseInt(minDelivery, 10))
    }
    if (maxDelivery) {
      formattedGigs = formattedGigs.filter(gig => gig.deliveryTime && gig.deliveryTime <= parseInt(maxDelivery, 10))
    }

    return NextResponse.json(formattedGigs)
  } catch (error) {
    // The error you are asking about is here:
    // This is the catch block for the GET handler, which logs and returns a 500 error if something goes wrong.
    console.error('Error fetching gigs:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { title, description, category, subcategory, price, images, packages } = data

    // Type for package input
    type PackageInput = {
      name: string
      description: string
      price: number
      deliveryTime: string
      revisions: number
      features: string[]
    }

    const gigPrice = Array.isArray(packages) && packages.length > 0
      ? Math.min(...packages.map((pkg: PackageInput) => Number(pkg.price)))
      : Number(price);
    if (isNaN(gigPrice)) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }
    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        category,
        subcategory,
        price: gigPrice,
        images,
        seller: { connect: { id: session.user.id } },
        packages: {
          create: (Array.isArray(packages) ? packages : []).map((pkg: PackageInput) => ({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            deliveryTime: typeof pkg.deliveryTime === 'string' ? parseInt(pkg.deliveryTime, 10) : pkg.deliveryTime,
            revisions: pkg.revisions,
            features: pkg.features,
          })),
        },
      },
      include: {
        packages: true,
      },
    })

    return NextResponse.json(gig)
  } catch (error) {
    // The error you are asking about is here:
    // This is the catch block for the POST handler, which logs and returns a 500 error if something goes wrong.
    console.error('Error creating gig:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 