import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma'
import { auth } from '@/app/config/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        description: true,
        hourlyRate: true,
        level: true,
        responseTime: true,
        skills: true,
        languages: true,
        createdAt: true,
        _count: {
          select: {
            gigs: true,
            orders: true,
            receivedReviews: true,
            sellerOrders: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate statistics
    const stats = {
      activeGigs: user._count.gigs,
      completedOrders: user._count.sellerOrders,
      totalReviews: user._count.receivedReviews,
      totalEarnings: 0, // TODO: Calculate from completed orders
    }

    return NextResponse.json({ user, stats })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, title, description, hourlyRate, level, responseTime, skills, languages, role } = body

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Validate role if provided
    const allowedRoles = ['USER', 'SELLER', 'ADMIN']
    let roleData = undefined
    if (role) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
      roleData = role
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        description: description?.trim() || null,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        level: level?.trim() || null,
        responseTime: responseTime?.trim() || null,
        skills: skills || [],
        languages: languages || [],
        ...(roleData ? { role: roleData } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        title: true,
        description: true,
        hourlyRate: true,
        level: true,
        responseTime: true,
        skills: true,
        languages: true,
        role: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 