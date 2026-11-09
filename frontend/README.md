# CARTHAGE DRIVE - Angular Frontend

A modern, responsive Angular 16+ frontend application for the Carthage Drive car rental platform built in Tunisia.

## 📋 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards (auth, admin)
│   │   ├── interceptors/    # HTTP interceptors (JWT)
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Core services (Auth, API)
│   ├── features/            # Feature modules
│   │   ├── auth/            # Login, Register
│   │   ├── booking/         # Booking process
│   │   ├── cars/            # Car listing and details
│   │   ├── client/          # Client dashboard
│   │   ├── admin/           # Admin dashboard
│   │   ├── home/            # Home page
│   │   └── pages/           # Static pages (About, Contact, FAQ)
│   ├── shared/              # Shared components and utilities
│   │   └── components/      # Reusable components (Navbar, Footer, Layout)
│   ├── app.component.ts     # Root component
│   └── app.routes.ts        # Route configuration
├── environments/            # Environment configurations
├── styles.css              # Global styles
└── index.html              # HTML entry point
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
cd c:\CARTHAGE DRIVE2\frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API URL** (if needed)
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://localhost/carthage-drive-backend/api'
};
```

4. **Start development server**
```bash
npm start
```

The application will open at `http://localhost:4200`

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/cars` - Car listing
- `/cars/:id` - Car details
- `/about` - About page
- `/contact` - Contact form
- `/faq` - FAQ page
- `/auth/login` - Login
- `/auth/register` - Registration
- `/auth/forgot-password` - Password reset

### Protected Routes (Authenticated users)
- `/booking/:carId` - Booking form
- `/booking/confirmation/:id` - Booking confirmation
- `/client/dashboard` - Client dashboard
- `/client/profile` - User profile
- `/client/reservations` - User's reservations

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/cars` - Car management
- `/admin/bookings` - Booking management
- `/admin/users` - User management

## 🔐 Authentication

The frontend uses JWT-based authentication:

1. **Login** - User provides credentials
2. **Token Storage** - JWT token stored in localStorage
3. **Auto-attach** - JWT interceptor automatically adds token to requests
4. **Route Guards** - Protected routes check authentication status
5. **Logout** - Token removed from storage

### Guards
- `authGuard` - Requires authentication
- `adminGuard` - Requires admin role
- `noAuthGuard` - Prevents authenticated users (for login page)

## 🎨 Styling

Global styles are in `src/styles.css` with:
- CSS Variables for colors, spacing, and transitions
- Responsive design with mobile-first approach
- Reusable utility classes
- Component-specific styles in component files

### Color Scheme
- **Primary**: Dark Navy (`#1A1F3A`)
- **Accent**: Gold (`#D4AF37`)
- **Status**: Success, Warning, Danger, Info

## 📡 API Integration

All API calls go through `ApiService` in `src/app/core/services/api.service.ts`

Example:
```typescript
this.apiService.getCars(filters, sort).subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    // Handle error
  }
});
```

## 🔄 Data Flow

1. **Component** - Handles user interaction
2. **Service** - Makes API call via HttpClient
3. **Interceptor** - Adds JWT token
4. **Backend** - Processes request
5. **Response** - Returns to component
6. **Component** - Updates UI

## 🧪 Development

### Add New Component
```bash
ng generate component features/my-feature/my-component
```

### Add New Service
```bash
ng generate service core/services/my-service
```

### Build for Production
```bash
npm run build:prod
```

## 📦 Dependencies

- **@angular/core** - Core framework
- **@angular/router** - Routing
- **@angular/forms** - Form handling
- **rxjs** - Reactive programming
- **TypeScript** - Type safety

## 🚀 Deployment

### To Deploy

1. **Build production bundle**
```bash
npm run build:prod
```

2. **Output** - Built files in `dist/carthage-drive/`

3. **Deploy** - Upload to web server

### Environment Configuration
- Development: `src/environments/environment.development.ts`
- Production: `src/environments/environment.production.ts`

## 🐛 Troubleshooting

### Issue: API calls failing
- Check backend is running at `http://localhost/carthage-drive-backend/api`
- Verify `environment.ts` has correct API URL
- Check browser console for CORS errors

### Issue: Routes not working
- Ensure `base href` in `index.html` matches deployment path
- Check `.htaccess` for proper rewriting (if using Apache)

### Issue: Styles not loading
- Clear browser cache
- Rebuild project: `npm run build`

## 📝 Notes

- Uses standalone components (Angular 14+)
- Lazy-loaded feature modules for performance
- Responsive design works on mobile, tablet, desktop
- Dark theme with gold accents for premium feel

## 📞 Support

For issues or questions:
1. Check the FAQ page in the app
2. Review error messages in browser console
3. Check backend logs at `backend/logs/error.log`

## 📄 License

All rights reserved - Carthage Drive 2026
