# Blog Engine

A modern full-stack blog application built with React and Node.js, featuring a clean, decoupled architecture. This project includes user authentication, full CRUD functionality for managing posts, and an intuitive user interface.

## Requirements

- Node.js (v18 or higher)
- Docker Desktop (for PostgreSQL database)

## Before You Start

1. Make sure Docker Desktop is installed and running
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Start Docker Desktop
   - Wait for Docker engine to be running (check the Docker Desktop dashboard)

## Tech Stack

| Category     | Technology                                       |
| ------------ | ------------------------------------------------ |
| **Frontend** | React, Vite, TypeScript, React Router, Chakra UI |
| **Backend**  | Node.js, Express.js, TypeScript, Prisma (ORM)    |
| **Database** | PostgreSQL (run via Docker)                      |
| **API**      | REST, JSON, JWT for Authentication               |

## Getting Started

**1. Make sure Docker is running**

- Open Docker Desktop
- Wait until you see "Docker Desktop is running" in the Docker Dashboard

**2. Clone the Repository**

```bash
git clone https://github.com/gshlok/blog-engine.git
cd blog-engine
```

**3. Configure Security Settings**
Create a `.env` file in the `server` directory with your own secure values:

```bash
# Required: Generate your own secure JWT secret
JWT_SECRET="your-own-secure-secret-here"

# Optional: Customize database credentials (default values shown below)
DB_USER="bloguser"
DB_PASSWORD="securepassword123"
DB_NAME="blogdb"
```

To generate a secure JWT secret, you can use:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**3. Setup Everything**

```bash
git clone https://github.com/gshlok/blog-engine.git
cd blog-engine
npm run setup
```

**4. Run the Application**

```bash
npm run dev
```

## Security Notes

- **Never commit `.env` files to version control**
- Generate your own JWT secret - don't use the default
- Change default database credentials in production
- The setup script will respect your custom environment variables if provided
- For production deployment, additional security measures are recommended

## Features

- 🔐 User Authentication (Register/Login)
- ✍️ Create, Edit, and Delete Blog Posts
- 📱 Responsive Design
- 🎨 Modern UI with Chakra UI
- 🔒 Secure API with JWT Authentication
- 🗄️ PostgreSQL Database (via Docker)

## Development

All configurations are handled automatically by the setup script. The script will:

- Configure the PostgreSQL database in Docker
- Set up all environment variables
- Generate a secure JWT secret
- Install all dependencies

After running `npm run dev`, you can:

1. Register a new account at `http://localhost:5173/register`
2. Log in with your credentials
3. Start creating and managing blog posts

The API will be available at `http://localhost:3000` but you won't need to interact with it directly.
