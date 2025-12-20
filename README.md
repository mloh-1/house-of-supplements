# House of Supplements - E-commerce Website

Modern e-commerce platform for a Serbian supplement store, built with Next.js 15, shadcn/ui, and PostgreSQL.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Language**: TypeScript

## Features

### Public Store
- Modern responsive design with Serbian localization
- Hero carousel with admin-controlled promotions
- Product categories with filtering
- Product detail pages with variants (size, flavor)
- Shopping cart with local storage persistence
- Special offers with countdown timers
- Newsletter subscription
- User authentication (login/register)

### Admin Panel (`/admin`)
- Dashboard with sales statistics
- Product management (CRUD)
- Category management
- Brand management
- Hero promo/banner management
- Special offers management with date range
- Order management
- User management

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/house_of_supplements"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

3. Generate Prisma client and push schema to database:
```bash
npm run db:generate
npm run db:push
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials
- Email: `admin@houseofsupplements.rs`
- Password: `admin123`

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (public)/         # Public store pages
│   ├── admin/            # Admin panel pages
│   └── api/              # API routes
├── components/
│   ├── admin/            # Admin-specific components
│   ├── category/         # Category filter components
│   ├── home/             # Homepage components
│   ├── layout/           # Header, Footer
│   ├── products/         # Product card, etc.
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
├── store/
│   └── cart.ts           # Zustand cart store
└── types/
    └── next-auth.d.ts    # NextAuth type extensions
```

## Database Schema

Key models:
- **User**: Customer and admin accounts
- **Product**: Products with variants, pricing, inventory
- **Category**: Hierarchical categories
- **Brand**: Product brands
- **HeroPromo**: Homepage carousel slides
- **SpecialOffer**: Time-limited offers with countdown
- **Order/OrderItem**: Customer orders
- **CartItem/WishlistItem**: User cart and wishlist

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Customization

### Colors
The color scheme uses:
- Primary: Navy blue (`#1e3a5f`)
- Accent: Orange (`#f97316`)

These can be modified in `tailwind.config.ts` and `src/app/globals.css`.

### Fonts
- Display: Bebas Neue (bold headings)
- Body: DM Sans (readable body text)

## License

Private - All rights reserved.
