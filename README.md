# Colleague At Work Frontend (React + Vite)

Modern React application for managing colleague information with real-time status updates. Built with React, Vite, and TypeScript.

## Features

- ✅ **Modern React 19** with hooks and functional components
- ✅ **Real-time status updates** via Server-Sent Events (SSE)
- ✅ **Responsive design** with modern CSS
- ✅ **Authentication system** with login/logout functionality
- ✅ **Photo upload** and management
- ✅ **SPA routing** with React Router
- ✅ **Live status indicators** for colleagues
- ✅ **Optimistic UI updates** for better UX
- ✅ **TypeScript support** for type safety
- ✅ **ESLint configuration** for code quality

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Modern styling with gradients and animations
- **TypeScript** - Type safety and better development experience

## Installation

1. Navigate to the frontend directory:
```bash
cd colleagueAtWorkFront
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env file with your domain
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/colleagues`

## Project Structure

```
src/
├── components/          # React components
│   ├── ColleaguesList.jsx
│   ├── ColleagueDetail.jsx
│   ├── ColleagueForm.jsx
│   ├── Login.jsx
│   ├── Navigation.jsx
│   └── Modal.jsx
├── context/            # React context providers
│   ├── AuthContext.jsx
│   └── AuthProvider.jsx
├── hooks/              # Custom React hooks
│   ├── useAuth.js
│   └── useStatusStream.js
├── config/             # Configuration files
│   └── api.js
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles

public/                 # Static assets
dist/                   # Built files (after build)
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
# Production domain (without protocol)
VITE_PRODUCTION_DOMAIN=https://your-domain.com

# Development settings
VITE_DEV_API_URL=http://localhost:3001/api
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run build:prod      # Build with production settings
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Deployment
npm run deploy          # Build for deployment
```

## Development

### Local Development

1. **Start the backend** (in another terminal):
```bash
cd ../colleagueAtWorkBackend
npm start
```

2. **Start the frontend**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:5173/colleagues
```

### Testing Locally

```bash
# Test the application locally
chmod +x test-local-colleagues.sh
./test-local-colleagues.sh
```

## Features Overview

### 🔐 Authentication
- Login/logout functionality
- Protected routes for add/edit operations
- Guest access for viewing and status updates
- Default credentials: `admin` / `admin123`

### 👥 Colleague Management
- **List View**: Grid layout with photos and status
- **Detail View**: Complete information with photo
- **Add/Edit Form**: Comprehensive form with photo upload
- **Real-time Status**: Live updates via SSE

### 📱 Responsive Design
- Mobile-friendly interface
- Modern gradient backgrounds
- Smooth animations and transitions
- Status indicators with emojis

### 🔄 Real-time Features
- **Server-Sent Events**: Live status updates
- **Optimistic UI**: Immediate feedback
- **Connection Status**: Visual indicator
- **Auto-reconnect**: Automatic reconnection

## API Integration

The frontend communicates with the backend API:

### Base URLs
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/colleagues/api`

### Key Endpoints
- `GET /colleagues` - List all colleagues
- `GET /colleagues/:id` - Get single colleague
- `POST /colleagues` - Add new colleague (auth required)
- `PUT /colleagues/:id` - Update colleague (auth required)
- `PATCH /colleagues/:id/status` - Update status (public)
- `GET /colleagues/status/stream` - SSE for real-time updates

## Routing

The application uses React Router with the `/colleagues` base path:

- `/colleagues/` - Main list view
- `/colleagues/colleague/:id` - Detail view
- `/colleagues/add` - Add new colleague (auth required)
- `/colleagues/edit/:id` - Edit colleague (auth required)
- `/colleagues/login` - Login page

## Styling

### CSS Features
- **CSS Variables**: Consistent theming
- **Flexbox/Grid**: Modern layouts
- **Gradients**: Beautiful backgrounds
- **Animations**: Smooth transitions
- **Responsive**: Mobile-first design

### Color Scheme
- Primary: Purple gradient (`#667eea` to `#764ba2`)
- Success: Green (`#4ade80`)
- Error: Red (`#ef4444`)
- Text: White on dark backgrounds

## Deployment

### Production Build

1. **Set up environment**:
```bash
./setup-env.sh your-domain.com
```

2. **Build the application**:
```bash
npm run build:prod
```

3. **Deploy files**:
```bash
# Upload dist/ folder to your server
# Configure nginx with nginx-improved.conf
```

### Nginx Configuration

Use the provided nginx configuration:

```bash
# Generate nginx config
./generate-nginx-config.sh your-domain.com

# Install on server
sudo cp nginx-generated.conf /etc/nginx/sites-available/colleagues
sudo ln -s /etc/nginx/sites-available/colleagues /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Development Workflow

### Code Quality
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **TypeScript**: Type safety (when using .tsx files)

### Git Workflow
1. Create feature branch
2. Make changes
3. Run `npm run lint`
4. Test locally
5. Commit and push

### Testing
- Manual testing of all features
- Browser compatibility testing
- Mobile responsiveness testing
- Real-time functionality testing

## Troubleshooting

### Common Issues

1. **"No routes matched location"**
   - Ensure you're accessing `/colleagues` path
   - Check that backend is running on port 3001

2. **API calls failing**
   - Verify backend is running
   - Check CORS configuration
   - Ensure correct API base URL

3. **Real-time updates not working**
   - Check SSE endpoint is accessible
   - Verify network connectivity
   - Check browser console for errors

4. **Build errors**
   - Clear node_modules and reinstall
   - Check environment variables
   - Verify all dependencies are installed

### Debug Mode

Enable debug logging in the browser console:

```javascript
// In browser console
localStorage.setItem('debug', 'true');
```

## Performance

### Optimizations
- **Code splitting**: Vendor and router chunks
- **Image optimization**: Proper sizing and formats
- **Lazy loading**: Components loaded on demand
- **Caching**: Static assets cached for 1 year

### Bundle Analysis
```bash
npm run build
# Check dist/ folder for chunk sizes
```

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the backend README
3. Check browser console for errors
4. Verify network connectivity
