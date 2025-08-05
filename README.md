# Sports Organization Platform

A comprehensive sports organization platform for managing tournaments, players, and organizers.

## 🚀 Features

- **User Management**: Registration and authentication for admins, organizers, and players
- **Tournament Management**: Create, view, and manage sports tournaments
- **Player Profiles**: Complete player registration with document uploads
- **Organizer Dashboard**: Tools for tournament organizers
- **Admin Console**: User management and system administration
- **File Upload**: Secure image uploads with Cloudinary integration

## 🛡️ Security Improvements

- **Environment Variables**: All sensitive data moved to `.env` file
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured CORS for production safety
- **SQL Injection Protection**: Parameterized queries throughout
- **File Upload Security**: File size limits and type validation

## 📁 Project Structure

```
├── config/
│   ├── database.js          # Database configuration and connection
│   └── cloudinary.js        # Cloudinary image upload configuration
├── middleware/
│   ├── validation.js        # Input validation rules
│   └── security.js          # Security middleware configuration
├── utils/
│   └── errorHandler.js      # Centralized error handling
├── public/                  # Frontend files
├── .env                     # Environment variables
├── server.js               # Main application file
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sports-organisation-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Server Configuration
   PORT=2008
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 API Endpoints

### Authentication
- `GET /save-user` - User registration
- `GET /login-user` - User login
- `GET /change-password` - Change password

### Tournament Management
- `GET /publish-event` - Create new tournament
- `GET /fetch-tournaments` - Get user's tournaments
- `GET /delete-tournamentmanager` - Delete tournament

### Player Management
- `POST /player-details` - Register player with documents
- `GET /fetch-player-records` - Get all players

### Organizer Management
- `POST /submit-org-details` - Submit organizer details
- `GET /fetch-org-records` - Get all organizers

### Data Queries
- `GET /dofetchdistinct-sports` - Get available sports
- `GET /dofetchdistinct-cities` - Get available cities
- `GET /fetch-player-tournaments-cards` - Get tournaments by filters

### Admin Functions
- `GET /dofetchrecords` - Get all users
- `GET /doblock` - Block user
- `GET /doactive` - Activate user

## 🛡️ Security Features

### Input Validation
- Email format validation
- Password strength requirements
- File type and size validation
- SQL injection prevention

### Rate Limiting
- General rate limiting: 100 requests per 15 minutes
- Authentication rate limiting: 5 attempts per 15 minutes

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- XSS Protection
- Content Type Options

## 🔄 Error Handling

The application includes comprehensive error handling:

- **Centralized Error Handler**: All errors are caught and formatted consistently
- **Database Error Handling**: Specific handling for common database errors
- **File Upload Error Handling**: Proper error handling for file uploads
- **Validation Error Handling**: Detailed validation error messages

## 📊 Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}, // Optional data object
  "errors": [] // Optional validation errors
}
```

## 🚀 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (to be implemented)

### Environment Variables
- `NODE_ENV` - Set to 'development' or 'production'
- `PORT` - Server port (default: 2008)

## 🔧 Database Schema

The application uses the following main tables:
- `usersss` - User accounts and authentication
- `tournaments` - Tournament information
- `players` - Player profiles and documents
- `organiser` - Organizer information

## 🚀 Deployment

### Production Checklist
1. Set `NODE_ENV=production` in `.env`
2. Update CORS origins in `middleware/security.js`
3. Ensure all environment variables are set
4. Use a process manager like PM2
5. Set up proper logging
6. Configure SSL/TLS certificates

### Environment Variables for Production
```env
NODE_ENV=production
PORT=2008
# Add your production database and cloudinary credentials
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This is an improved version of the original sports organization platform with enhanced security, better code structure, and comprehensive error handling. 