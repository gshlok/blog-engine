# Modern Chyrp Blog Engine

A modern, full-stack blog application built with React and Node.js, featuring a clean, decoupled architecture. This project includes comprehensive blog engine features, user authentication, full CRUD functionality for managing posts, and an intuitive user interface.

## 🚀 Features

### Core Blog Engine Features
- **📝 Content Management**: Create, edit, and delete blog posts with rich text editing
- **🏷️ Categories & Tags**: Organize content with hierarchical categories and flexible tagging
- **📊 Analytics**: Track post views, likes, and engagement metrics
- **🔍 Advanced Search**: Full-text search with filters for categories, tags, authors, and dates
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🎨 Modern UI**: Beautiful interface built with Chakra UI components

### Content Organization
- **Categories**: Hierarchical content organization with custom colors and descriptions
- **Tags**: Flexible tagging system for cross-content relationships
- **Post Status**: Draft, Published, Scheduled, and Private post states
- **Featured Posts**: Highlight important content
- **Post Excerpts**: Custom summaries for better content previews

### Search & Discovery
- **Full-Text Search**: Search across titles, content, and excerpts
- **Advanced Filtering**: Filter by category, tags, author, status, and date ranges
- **Sorting Options**: Sort by newest, oldest, title, views, or likes
- **Pagination**: Efficient browsing through large content collections
- **Search Suggestions**: Autocomplete and search recommendations

### Admin Dashboard
- **📊 Analytics Overview**: Comprehensive statistics and insights
- **📝 Post Management**: Full CRUD operations with bulk actions
- **🏷️ Category Management**: Create, edit, and organize content categories
- **🔖 Tag Management**: Manage content tags and relationships
- **📈 Performance Metrics**: View counts, engagement rates, and trends

### SEO & Performance
- **Meta Tags**: Custom title, description, and keywords for each post
- **URL Optimization**: Clean, SEO-friendly URLs with automatic slug generation
- **Performance Tracking**: Monitor post performance and user engagement
- **Responsive Images**: Optimized image handling and display

## 🛠️ Tech Stack

| Category     | Technology                                       |
| ------------ | ------------------------------------------------ |
| **Frontend** | React 18, Vite, TypeScript, React Router, Chakra UI |
| **Backend**  | Node.js, Express.js, TypeScript, Prisma (ORM)    |
| **Database** | PostgreSQL (run via Docker)                      |
| **API**      | REST, JSON, JWT for Authentication               |
| **Search**   | Full-text search with advanced filtering         |

## 📋 Requirements

- Node.js (v18 or higher)
- Docker Desktop (for PostgreSQL database)
- Modern web browser

## 🚀 Getting Started

### 1. Prerequisites
Make sure Docker Desktop is installed and running:
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Start Docker Desktop
- Wait for Docker engine to be running

### 2. Clone and Setup
```bash
git clone https://github.com/gshlok/blog-engine.git
cd blog-engine
npm run setup
```

### 3. Configure Environment
Create a `.env` file in the `server` directory:
```bash
# Required: Generate your own secure JWT secret
JWT_SECRET="your-own-secure-secret-here"

# Optional: Customize database credentials
DB_USER="bloguser"
DB_PASSWORD="securepassword123"
DB_NAME="blogdb"
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run the Application
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - Get published posts with pagination and filters
- `GET /api/posts/featured` - Get featured posts
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create new post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with posts
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:slug` - Get tag with posts
- `POST /api/tags` - Create tag (admin)
- `PUT /api/tags/:id` - Update tag (admin)
- `DELETE /api/tags/:id` - Delete tag (admin)

### Search
- `GET /api/search` - Advanced search with filters
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/popular` - Get popular search terms

## 🎯 Usage Guide

### Creating Your First Post
1. Register an account at `/register`
2. Log in at `/login`
3. Navigate to Admin Dashboard
4. Click "Create Post" or go to `/admin/posts/new`
5. Fill in title, content, and optional excerpt
6. Select category and add tags
7. Choose post status (Draft/Published/Scheduled)
8. Save your post

### Managing Categories
1. Go to Admin Dashboard → Categories tab
2. Click "Add Category"
3. Enter name, description, and choose a color
4. Categories help organize your content and improve navigation

### Using Tags
1. Tags provide flexible content organization
2. Add multiple tags to posts for better discoverability
3. Tags can be used in search and filtering

### Advanced Search
1. Use the search bar for quick text search
2. Click the filter icon for advanced options
3. Filter by category, tags, author, or date ranges
4. Sort results by various criteria

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🚀 Development

### Project Structure
```
blog-engine/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   └── lib/           # Utility libraries
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── package.json           # Root package.json
```

### Available Scripts
- `npm run setup` - Initial setup and dependency installation
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build production versions
- `npm run start` - Start production server

### Database Migrations
The setup script automatically handles database migrations. To manually run migrations:
```bash
cd server
npx prisma migrate dev
```

## 🌟 Advanced Features

### Post Scheduling
- Schedule posts for future publication
- Automatic status updates based on schedule
- Timezone-aware scheduling

### Content Analytics
- View tracking with IP and user agent logging
- Like and engagement metrics
- Popular content identification

### SEO Optimization
- Custom meta titles and descriptions
- Keyword management
- Clean URL structure
- Social media optimization

### Performance Features
- Efficient database queries with proper indexing
- Pagination for large content collections
- Optimized search algorithms
- Responsive image handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🔮 Roadmap

- [ ] Comment moderation system
- [ ] Social media integration
- [ ] Email newsletter functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Content import/export tools
- [ ] Advanced media management
- [ ] Plugin system for extensibility

---

**Modern Chyrp Blog Engine** - Built with ❤️ using modern web technologies
