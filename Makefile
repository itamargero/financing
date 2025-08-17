# Financing.ph Development Makefile

.PHONY: help install up down build clean logs shell-www shell-admin db-reset test test-www test-admin test-watch coverage

# Default target
help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies for all projects"
	@echo "  make up         - Start development environment with hot reload"
	@echo "  make down       - Stop all containers"
	@echo "  make build      - Build all Docker images"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make logs       - View logs from all services"
	@echo "  make logs-www   - View logs from www service"
	@echo "  make logs-admin - View logs from admin service"
	@echo "  make shell-www  - Open shell in www container"
	@echo "  make shell-admin- Open shell in admin container"
	@echo "  make test       - Run all tests"
	@echo "  make test-www   - Run tests for www project"
	@echo "  make test-admin - Run tests for admin project"
	@echo "  make test-watch - Run tests in watch mode"
	@echo "  make coverage   - Generate test coverage report"
	@echo "  make db-reset   - Reset database (WARNING: destroys all data)"

# Install dependencies
install:
	@echo "Installing root dependencies..."
	npm install
	@echo "Installing www dependencies..."
	cd www && npm install
	@echo "Installing admin dependencies..."
	cd admin && npm install
	@echo "✅ All dependencies installed!"

# Start development environment
up:
	@echo "🚀 Starting development environment..."
	@echo "📊 www app will be available at: http://localhost:3000"
	@echo "🔧 admin app will be available at: http://localhost:3001"
	@echo "🗄️  PostgreSQL will be available at: localhost:5432"
	docker-compose up --build

# Stop all containers
down:
	@echo "🛑 Stopping all containers..."
	docker-compose down

# Build all images
build:
	@echo "🔨 Building all Docker images..."
	docker-compose build

# Clean up everything
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# View logs
logs:
	docker-compose logs -f

logs-www:
	docker-compose logs -f www

logs-admin:
	docker-compose logs -f admin

# Open shell in containers
shell-www:
	docker-compose exec www sh

shell-admin:
	docker-compose exec admin sh

# Testing commands
test:
	@echo "🧪 Running all tests..."
	cd www && npm test
	cd admin && npm test

test-www:
	@echo "🧪 Running www tests..."
	cd www && npm test

test-admin:
	@echo "🧪 Running admin tests..."
	cd admin && npm test

test-watch:
	@echo "🧪 Running tests in watch mode..."
	@echo "Choose project: [1] www [2] admin [3] both"
	@read -p "Enter choice: " choice; \
	case $$choice in \
		1) cd www && npm run test:watch;; \
		2) cd admin && npm run test:watch;; \
		3) concurrently "cd www && npm run test:watch" "cd admin && npm run test:watch";; \
		*) echo "Invalid choice";; \
	esac

coverage:
	@echo "📊 Generating test coverage..."
	cd www && npm run test:coverage
	cd admin && npm run test:coverage
	@echo "✅ Coverage reports generated!"

# Reset database (destructive)
db-reset:
	@echo "⚠️  WARNING: This will destroy all database data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo ""; \
		echo "🗄️  Resetting database..."; \
		docker-compose stop postgres; \
		docker-compose rm -f postgres; \
		docker volume rm financing_postgres_data 2>/dev/null || true; \
		docker-compose up -d postgres; \
		echo "✅ Database reset complete!"; \
	else \
		echo ""; \
		echo "❌ Database reset cancelled."; \
	fi