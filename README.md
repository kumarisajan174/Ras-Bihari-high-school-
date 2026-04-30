# Mahabodhi Internship Program

A beautiful, mobile-first, PWA for school internship platform for Mahabodhi Mahavidyalaya and Ras Bihari High School Nalanda.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: next-pwa

## Features

### Student Side (No Login Required)
- Browse classes (9-12)
- Browse sections (A-G)
- View teachers
- View homework, classwork, notices
- View today's highlights with glowing cards
- Beautiful glassmorphism UI
- Sticky bottom navigation
- Smooth animations

### Admin Panel (Password Protected)
- Add, edit, delete posts
- Manage teachers
- Manage classes & sections
- Highlight important posts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Update your .env file with your database URL and admin password:
```env
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"
ADMIN_PASSWORD="admin123"
```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com).

1. Push your code to GitHub
2. Import the project on Vercel
3. Add environment variables (DATABASE_URL, ADMIN_PASSWORD)
4. Deploy!

## Default Admin Password

Default: `admin123`

## License

MIT
