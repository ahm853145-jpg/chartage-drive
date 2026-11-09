import { Routes } from '@angular/router';
import { authGuard, adminGuard, noAuthGuard } from './core/guards/auth.guard';

/**
 * CARTHAGE DRIVE - Application Routes
 * Lazy-loaded feature modules for better performance
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cars',
    loadComponent: () => import('./features/cars/cars-list/cars-list.component').then(m => m.CarsListComponent)
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./features/cars/car-details/car-details.component').then(m => m.CarDetailsComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },
  {
    path: 'booking',
    canActivate: [authGuard],
    children: [
      {
        path: ':carId',
        loadComponent: () => import('./features/booking/booking-form/booking-form.component').then(m => m.BookingFormComponent)
      },
      {
        path: 'confirmation/:id',
        loadComponent: () => import('./features/booking/booking-confirmation/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
      }
    ]
  },
  {
    path: 'client',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/client/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/client/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/client/reservations/reservations.component').then(m => m.ReservationsComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'cars',
        loadComponent: () => import('./features/admin/cars-management/cars-management.component').then(m => m.CarsManagementComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/bookings-management/bookings-management.component').then(m => m.BookingsManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users-management/users-management.component').then(m => m.UsersManagementComponent)
      }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('./features/pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
