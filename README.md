# Handy Bee - Gig Marketplace Platform

A modern gig marketplace platform similar to Fiverr and Upwork, built with Next.js 13+, TypeScript, and Tailwind CSS.

## Features

### For Freelancers
- Create and manage gig listings
- Set custom pricing and delivery times
- Portfolio showcase
- Order management
- Review and rating system
- Payment processing
- Profile customization

### For Clients
- Browse and search gigs
- Filter by category, price, and rating
- Place orders
- Track order progress
- Leave reviews and ratings
- Secure payment system
- Messaging system

## Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── config/            # Configuration files
│   ├── gigs/             # Gig-related pages
│   ├── profile/          # User profile pages
│   ├── search/           # Search functionality
│   ├── orders/           # Order management
│   └── reviews/          # Review system
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── gigs/             # Gig-related components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── profile/          # Profile components
│   ├── search/           # Search components
│   ├── orders/           # Order components
│   ├── reviews/          # Review components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and hooks
│   ├── api/              # API utilities
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
└── prisma/               # Database schema and migrations
```

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **File Storage**: AWS S3
- **Search**: Algolia
- **Real-time**: Socket.io

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application URL
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `AWS_BUCKET_NAME`: S3 bucket name
- `ALGOLIA_APP_ID`: Algolia application ID
- `ALGOLIA_API_KEY`: Algolia API key

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
