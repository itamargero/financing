# Financing.ph - Loan Marketplace Platform

A comprehensive loan marketplace platform for the Philippines with SEO-optimized public website and admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Make (optional, for convenience commands)

### Development Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/financing
   ```

2. **Start the development environment:**
   ```bash
   make up
   # or
   docker-compose up --build
   ```

3. **Access the applications:**
   - 🌐 **Public Website (www)**: http://localhost:3000
   - 🔧 **Admin Dashboard**: http://localhost:3001
   - 🗄️ **PostgreSQL Database**: localhost:5432

### Available Commands

```bash
make install    # Install all dependencies
make up         # Start development with hot reload
make down       # Stop all containers
make build      # Build Docker images
make clean      # Clean up containers and volumes
make logs       # View all logs
make db-reset   # Reset database (destructive)
```

## 📁 Project Structure

```
financing/
├── www/                    # Public website (Next.js + v0.dev)
├── admin/                  # Admin dashboard (Next.js)
├── database/
│   └── init/              # Database schema and seed data
├── docker-compose.yml     # Development environment
├── Makefile              # Convenience commands
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL + Supabase
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Development**: Docker with hot reload

## 📊 Database

The database is automatically seeded with sample data including:
- ✅ 5 sample lenders (BPI, Metrobank, UnionBank, etc.)
- ✅ Multiple loan products
- ✅ Sample leads and applications
- ✅ Blog posts and categories
- ✅ Customer reviews

## 🔥 Hot Reload Development

Both applications support hot reload in Docker:
- File changes are instantly reflected
- Database changes persist across restarts
- No need to rebuild containers for code changes

## 🌍 Environment Variables

The development environment uses these pre-configured values:
- Clerk test keys (already configured)
- Local PostgreSQL connection
- Supabase URLs (update with real keys when ready)

## 📋 Next Steps

1. Start development with `make up`
2. Update Supabase keys in environment variables
3. Begin building admin features
4. Enhance SEO structure for public site
5. Deploy to Vercel when ready

## 🤝 Development Workflow

1. Make changes to code in `www/` or `admin/`
2. Changes are automatically reflected (hot reload)
3. Database changes persist in Docker volume
4. Use `make logs` to debug issues
5. Use `make db-reset` to start fresh if needed