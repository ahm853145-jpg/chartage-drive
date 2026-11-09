# CARTHAGE DRIVE - Backend Setup Guide

## Prerequisites
- **XAMPP** (Apache + MySQL + PHP)
- **PHP 7.4+**
- **MySQL 5.7+**

## Installation Steps

### 1. Setup Database

1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Click on "Import" tab
3. Select `database/carthage_drive.sql`
4. Click "Go" to create the database and tables
5. Then import `database/seed_data.sql` for sample data

### 2. Place Backend Files

Copy all backend files to:
```
C:\xampp\htdocs\carthage-drive-backend\
```

Directory structure should be:
```
carthage-drive-backend/
├── .env
├── .env.example
├── index.php
├── api/
│   └── routes.php
├── app/
│   ├── ApiResponse.php
│   ├── BaseController.php
│   ├── JwtHelper.php
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── CarController.php
│   │   ├── BookingController.php
│   │   ├── UserController.php
│   │   ├── AdminController.php
│   │   └── ContactController.php
│   └── Models/
│       ├── User.php
│       ├── Car.php
│       ├── Booking.php
│       └── ContactMessage.php
├── config/
│   ├── Database.php
│   └── Config.php
├── uploads/
│   └── cars/
└── logs/
```

### 3. Configure Environment

1. Rename `.env.example` to `.env`
2. Update the `.env` file with your settings:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=carthage_drive
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-secure-secret-key-here

CORS_ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### 4. Configure Apache

Create `.htaccess` file in `carthage-drive-backend/` folder:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /carthage-drive-backend/
    
    # Remove index.php from URL
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?/$1 [L]
</IfModule>
```

### 5. Create Required Directories

Create these folders inside `carthage-drive-backend/`:
- `uploads/cars/` - for car images
- `logs/` - for error logs

### 6. Test the Installation

Access the API in your browser:
```
http://localhost/carthage-drive-backend/
```

You should see a 404 error (which means the routing is working).

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/logout` - Logout user

### Cars
- **GET** `/api/cars` - Get all cars (with filters)
- **GET** `/api/cars/:id` - Get car details
- **POST** `/api/cars` - Create car (admin)
- **PUT** `/api/cars/:id` - Update car (admin)
- **DELETE** `/api/cars/:id` - Delete car (admin)

### Bookings
- **GET** `/api/bookings` - Get user's bookings
- **GET** `/api/bookings/:id` - Get booking details
- **POST** `/api/bookings` - Create booking
- **PUT** `/api/bookings/:id` - Update booking
- **DELETE** `/api/bookings/:id` - Cancel booking

### Users
- **GET** `/api/users/:id` - Get user profile
- **PUT** `/api/users/:id` - Update profile
- **PUT** `/api/users/:id/password` - Change password

### Admin
- **GET** `/api/admin/dashboard` - Dashboard statistics
- **GET** `/api/admin/users` - Get all users
- **GET** `/api/admin/bookings` - Get all bookings

### Contact
- **POST** `/api/contact` - Submit contact form

## Test Credentials

**Admin:**
- Email: `admin@carthagedrive.tn`
- Password: `Admin@123456`

**Client:**
- Email: `client@carthagedrive.tn`
- Password: `Client@123456`

## Troubleshooting

### 404 Errors
- Make sure `mod_rewrite` is enabled in Apache
- Check `.htaccess` file is in correct location

### Database Connection Error
- Verify MySQL is running
- Check `.env` database credentials
- Ensure `carthage_drive` database exists

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` in `.env`
- Add your frontend URL to the list

## Security Notes

1. **Change JWT_SECRET** in production - use a strong random string
2. **Use HTTPS** in production
3. **Never commit .env** file with real credentials
4. **Set proper file permissions** on uploads directory
5. **Validate all user input** (already implemented in models)
6. **Use prepared statements** (prevents SQL injection - already implemented)

## Next Steps

1. Setup the Angular frontend
2. Connect frontend to this API
3. Test all features
4. Deploy to production server

## Support

For issues or questions, check the error logs in `logs/error.log`
