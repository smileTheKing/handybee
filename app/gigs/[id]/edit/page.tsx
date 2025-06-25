import { prisma } from '@/prisma/prisma';
import GigSubmitForm from '@/components/forms/gig-submit-form';
import { auth } from '@/app/config/auth';
import { redirect } from 'next/navigation';

export default async function EditGigPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const gig = await prisma.gig.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      price: true,
      images: true,
      sellerId: true,
      // Add more fields as needed
    },
  });

  if (!gig || gig.sellerId !== session.user.id) {
    redirect('/profile');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Gig</h1>
      <GigSubmitForm gig={gig} isEdit={true} />
    </div>
  );
} 