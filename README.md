# Goodies - Contact Management App

A modern, responsive contact management web application built with Nuxt 3, Vue 3, and TailwindCSS.

## Features

- 📱 **Mobile-first responsive design** with TailwindCSS
- 🌙 **Dark mode support** with system preference detection
- 🔍 **Advanced search and filtering** by name, email, phone, location, and tags
- 📊 **Dashboard with statistics** showing total contacts, locations, and recent activity
- ⚡ **Cursor-based pagination** for efficient data loading
- 🏷️ **Tag and location management** for organizing contacts
- ✨ **Smooth animations** and transitions using GSAP
- 🗄️ **PostgreSQL database** with Prisma ORM
- 🚀 **Server-side rendering** with Nuxt 3

## Tech Stack

- **Frontend**: Nuxt 3 + Vue 3 + TailwindCSS
- **Backend**: Nuxt server routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Icons**: Heroicons
- **Notifications**: Notivue
- **Animations**: GSAP

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goodies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/goodies_db"
   
   # For production with Neon PostgreSQL:
   # DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   
   # Environment
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Push schema to database
   npm run prisma:schema
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Database Schema

### Contacts Table
- `id` - Primary key
- `name` - Contact name (required)
- `phone` - Phone number (optional)
- `email` - Email address (optional)
- `locationId` - Foreign key to locations table
- `tags` - Array of tags
- `notes` - Additional notes
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Locations Table
- `id` - Primary key
- `name` - Location name (unique)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

### Contacts
- `GET /api/contacts` - Get contacts with pagination and filtering
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts/[id]` - Get a specific contact
- `PUT /api/contacts/[id]` - Update a contact
- `DELETE /api/contacts/[id]` - Delete a contact

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create a new location

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Cursor-Based Pagination

The app uses cursor-based pagination for efficient data loading:

```javascript
// Request format
GET /api/contacts?limit=20&cursor=base64EncodedCursor

// Response format
{
  "data": [...contacts...],
  "nextCursor": "base64EncodedCursor",
  "hasMore": true
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:schema` - Push schema to database

### Project Structure

```
├── components/          # Vue components
├── pages/              # Nuxt pages
├── server/             # Server-side code
│   └── api/           # API routes
├── prisma/            # Database schema and migrations
├── assets/            # Static assets
└── stores/            # Pinia stores
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
