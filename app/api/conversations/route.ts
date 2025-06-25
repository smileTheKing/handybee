import { NextResponse } from 'next/server';
import { auth } from '@/app/config/auth';
import { prisma } from '@/prisma/prisma';

// GET - Fetch user conversations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all orders where the user is either buyer or seller
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Format conversations
    const conversations = orders.map(order => {
      const otherUser = order.buyerId === session.user!.id ? order.seller : order.buyer;
      const lastMessage = order.messages[0];
      // For now, we'll set unread count to 0 since readAt is not in the schema
      const unreadCount = 0;

      return {
        id: order.id,
        orderId: order.id,
        otherUser,
        gig: order.gig,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          sender: lastMessage.sender
        } : null,
        totalMessages: order._count.messages,
        unreadCount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 