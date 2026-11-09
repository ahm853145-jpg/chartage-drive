# CARTHAGE DRIVE - COMPLETE SETUP GUIDE

## 🎯 PROJECT OVERVIEW

**Carthage Drive** is a full-stack car rental platform built with:
- **Backend**: PHP REST API with JWT authentication
- **Frontend**: Angular 16+ with standalone components
- **Database**: MySQL with 11 interconnected tables
- **Architecture**: Microservices-ready with role-based access control

---

## 📁 PROJECT STRUCTURE

```
CARTHAGE DRIVE2/
├── database/
│   ├── carthage_drive.sql          (Database schema - 11 tables)
│   └── seed_data.sql               (Sample test data)
├── backend/
│   ├── .env                        (Configuration)
│   ├── .env.example                (Template)
│   ├── .htaccess                   (Apache routing)
│   ├── index.php                   (Entry point)
│   ├── README.md                   (Backend setup)
│   ├── api/
│   │   └── routes.php              (Routing system)
│   ├── app/
│   │   ├── ApiResponse.php         (JSON responses)
│   │   ├── BaseController.php      (Shared logic)
│   │   ├── JwtHelper.php           (Token management)
│   │   ├── Controllers/            (6 controllers)
│   │   └── Models/                 (4 models)
│   └── config/
│       ├── Database.php            (PDO connection)
│       └── Config.php              (Env loader)
└── frontend/
    ├── package.json                (Dependencies)
    ├── angular.json                (Angular config)
    ├── tsconfig.json               (TypeScript config)
    ├── README.md                   (Frontend setup)
    ├── src/
    │   ├── main.ts                 (Entry point)
    │   ├── index.html              (HTML template)
    │   ├── styles.css              (Global styles)
    │   ├── environments/           (Config)
    │   └── app/
    │       ├── app.component.ts    (Root)
    │       ├── app.routes.ts       (Routes)
    │       ├── core/               (Services, guards, models)
    │       ├── features/           (Feature modules)
    │       └── shared/             (Reusable components)
    └── .gitignore
```

---

## 🚀 QUICK START

### 1. Database Setup (1-2 minutes)

#### Using XAMPP:
1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Click "Import"
3. Select `database/carthage_drive.sql`
4. Click "Go"
5. Repeat with `database/seed_data.sql`

**Test Credentials:**
- Admin: `admin@carthagedrive.tn` / `Admin@123456`
- Client: `client@carthagedrive.tn` / `Client@123456`

### 2. Backend Setup (2-3 minutes)

1. Copy backend folder to XAMPP:
   ```
   C:\xampp\htdocs\carthage-drive-backend\
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```

3. Update `.env` with your settings:
   ```
   DB_HOST=localhost
   DB_DATABASE=carthage_drive
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Ensure Apache rewrite module is enabled

5. Test: Visit `http://localhost/carthage-drive-backend/`

### 3. Frontend Setup (3-5 minutes)

1. Install Node.js (if not installed)

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Browser opens to `http://localhost:4200`

---

## 🔧 CONFIGURATION

### Backend Configuration (`.env`)

```env
# Application
APP_NAME=Carthage Drive
APP_ENV=development
APP_DEBUG=true

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=carthage_drive
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=86400

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### Frontend Configuration (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost/carthage-drive-backend/api',
  appName: 'Carthage Drive',
  appSlogan: 'Votre route commence ici'
};
```

---

## 📚 API ENDPOINTS

### Authentication
```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
```

### Cars
```
GET    /api/cars                   - List cars (with filters)
GET    /api/cars/:id               - Get car details
POST   /api/cars                   - Create car (admin)
PUT    /api/cars/:id               - Update car (admin)
DELETE /api/cars/:id               - Delete car (admin)
```

### Bookings
```
GET    /api/bookings               - Get user bookings
GET    /api/bookings/:id           - Get booking details
POST   /api/bookings               - Create booking
PUT    /api/bookings/:id           - Update booking
DELETE /api/bookings/:id           - Cancel booking
```

### Users
```
GET    /api/users/:id              - Get user profile
PUT    /api/users/:id              - Update profile
PUT    /api/users/:id/password     - Change password
```

### Admin
```
GET    /api/admin/dashboard        - Dashboard statistics
GET    /api/admin/users            - List all users
GET    /api/admin/bookings         - List all bookings
```

### Contact
```
POST   /api/contact                - Submit contact form
```

---

## 🧭 FRONTEND ROUTES

### Public Routes
- `/` → Home page
- `/cars` → Car listing with filters
- `/cars/:id` → Car details and booking form
- `/about` → About company
- `/contact` → Contact form
- `/faq` → Frequently asked questions
- `/auth/login` → Login page
- `/auth/register` → Registration page
- `/auth/forgot-password` → Password reset

### Protected Routes (Login Required)
- `/booking/:carId` → Booking form
- `/booking/confirmation/:id` → Booking confirmation
- `/client/dashboard` → Client dashboard
- `/client/profile` → User profile settings
- `/client/reservations` → My reservations

### Admin Routes (Admin Only)
- `/admin/dashboard` → Admin dashboard with stats
- `/admin/cars` → Manage cars
- `/admin/bookings` → Manage bookings
- `/admin/users` → Manage users

---

## 🔐 AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────────────┐
│                   Frontend                          │
├─────────────────────────────────────────────────────┤
│  1. User enters email/password                      │
│  2. Sends to POST /api/auth/login                   │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                   Backend                           │
├─────────────────────────────────────────────────────┤
│  3. Verifies credentials                            │
│  4. Generates JWT token                             │
│  5. Returns token + user data                       │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                   Frontend                          │
├─────────────────────────────────────────────────────┤
│  6. Stores token in localStorage                    │
│  7. Sets user context                               │
│  8. Redirects to dashboard                          │
└─────────────────────────────────────────────────────┘

SUBSEQUENT REQUESTS:
┌─────────────────────────────────────────────────────┐
│  JWT Interceptor automatically adds:                │
│  Authorization: Bearer <token>                      │
└─────────────────────────────────────────────────────┘
```

---

## 📱 FEATURES IMPLEMENTED

### ✅ Phase 1: Database & Backend
- [x] 11 database tables with relationships
- [x] JWT authentication system
- [x] Role-based access control (CLIENT/ADMIN)
- [x] 6 REST API controllers
- [x] 4 database models
- [x] Password hashing with bcrypt
- [x] Input validation
- [x] Error handling
- [x] CORS support

### ✅ Phase 2: Frontend Scaffold
- [x] Angular project setup
- [x] Routing with guards
- [x] Core services (Auth, API)
- [x] Shared components (Navbar, Footer, Layout)
- [x] Global styling system
- [x] 20+ component placeholders
- [x] Environment configuration
- [x] Home page with hero section
- [x] Contact form
- [x] FAQ page

### 🔄 Phase 3: Component Implementation (Next)
- [ ] Fill in all placeholder components
- [ ] Add forms with validation
- [ ] Add data tables with pagination
- [ ] Add charts for admin dashboard
- [ ] Add image upload functionality
- [ ] Add date range pickers for bookings
- [ ] Add search and filtering

---

## 🎨 DESIGN SYSTEM

### Colors
```css
Primary Dark:     #1A1F3A  (Navy)
Primary Navy:     #0D0E27  (Very Dark)
Primary Blue:     #1e3a8a  (Bright)
Accent Gold:      #D4AF37  (Premium)
Accent Orange:    #FF6B35  (Modern)
```

### Responsive Breakpoints
```css
Desktop:   > 1200px
Tablet:    768px - 1200px
Mobile:    < 768px
```

### Font
- **Primary**: Poppins (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI'

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Problem**: "Database connection failed"
- ✓ Check MySQL is running
- ✓ Verify credentials in `.env`
- ✓ Ensure `carthage_drive` database exists

**Problem**: "404 not found" on API endpoints
- ✓ Check `.htaccess` is in backend folder
- ✓ Enable `mod_rewrite` in Apache
- ✓ Verify API URL in frontend configuration

**Problem**: "CORS error"
- ✓ Update `CORS_ALLOWED_ORIGINS` in `.env`
- ✓ Include your frontend URL (e.g., `http://localhost:4200`)

### Frontend Issues

**Problem**: "API calls failing"
- ✓ Ensure backend is running
- ✓ Check browser console for exact error
- ✓ Verify API URL in `environment.ts`
- ✓ Check backend logs at `backend/logs/error.log`

**Problem**: "Styles not loading"
- ✓ Clear browser cache (Ctrl+Shift+Delete)
- ✓ Rebuild: `npm run build`
- ✓ Check `styles.css` is referenced in `angular.json`

**Problem**: "Routes not working"
- ✓ Verify routing is correct in `app.routes.ts`
- ✓ Check component paths match imports
- ✓ Ensure components are standalone or properly imported

---

## 📊 DATABASE SCHEMA

### Users Table
```sql
- id (Primary Key)
- first_name, last_name
- email (Unique)
- phone
- password (hashed)
- role (CLIENT, ADMIN)
- status (ACTIVE, INACTIVE)
```

### Cars Table
```sql
- id (Primary Key)
- brand, model, year
- category (Économique, Premium, SUV, etc)
- price_per_day
- fuel_type, transmission
- seats, doors
- description
- status (ACTIVE, MAINTENANCE, INACTIVE)
```

### Bookings Table
```sql
- id (Primary Key)
- booking_number (Unique)
- user_id (FK → Users)
- car_id (FK → Cars)
- start_date, end_date
- pickup_location, return_location
- total_days, price_per_day, total_price
- status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
```

### Additional Tables
- `car_images` - Multiple images per car
- `payments` - Payment tracking
- `reviews` - Customer reviews
- `contact_messages` - Contact form submissions
- Plus 3 more for extensibility

---

## 🚢 DEPLOYMENT

### To Production

**Backend:**
1. Upload to production server
2. Update `.env` with production settings
3. Change `APP_ENV=production`
4. Set `APP_DEBUG=false`
5. Use strong `JWT_SECRET`
6. Enable HTTPS

**Frontend:**
1. Build production bundle:
   ```bash
   npm run build:prod
   ```
2. Upload `dist/carthage-drive/` to web server
3. Configure web server for SPA routing
4. Update `environment.production.ts` with API URL

---

## 📞 SUPPORT & RESOURCES

### Documentation
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- API Endpoints: See section above
- Database Schema: `database/carthage_drive.sql`

### Testing Credentials
- **Admin**
  - Email: `admin@carthagedrive.tn`
  - Password: `Admin@123456`

- **Client**
  - Email: `client@carthagedrive.tn`
  - Password: `Client@123456`

### Sample Data
- 3 test users
- 10 sample cars
- 4 sample bookings
- All in `database/seed_data.sql`

---

## ✨ NEXT STEPS

1. **Complete Frontend Components** - Fill in all 20+ placeholder components with actual UI
2. **Add Forms & Validation** - Create booking form, login form, etc.
3. **Add Data Tables** - Admin tables with sorting/filtering
4. **Add Charts** - Dashboard statistics visualization
5. **Image Uploads** - Car image management
6. **Email Integration** - Send confirmation emails
7. **Payment Integration** - Connect Stripe for payments
8. **Testing** - Unit tests and E2E tests
9. **Deployment** - Deploy to production server
10. **Monitoring** - Setup error tracking and analytics

---

## 📝 PROJECT STATISTICS

- **Database**: 11 tables, 50+ columns
- **Backend**: 6 controllers, 4 models, 12+ endpoints
- **Frontend**: 20+ components, 10+ routes
- **Lines of Code**: ~5,000+ (backend + frontend)
- **Estimated Time**: 40-60 hours to complete

---

**Happy Coding! 🚗💨**

*Carthage Drive - Votre route commence ici* ✨
