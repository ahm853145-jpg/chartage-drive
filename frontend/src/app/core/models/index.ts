/**
 * CARTHAGE DRIVE - Models & Interfaces
 * Data types used throughout the application
 */

// ========== Auth Models ==========
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  created_at: string;
  updated_at: string;
  booking_count?: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'ADMIN';
  token: string;
}

// ========== Car Models ==========
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  price_per_day: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  doors: number;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  created_at: string;
  updated_at: string;
  images?: CarImage[];
}

export interface CarImage {
  id: number;
  car_id: number;
  image_url: string;
  created_at: string;
}

export interface CarFilter {
  brand?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  fuel_type?: string;
  transmission?: string;
  seats?: number;
}

export interface CarSort {
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  per_page?: number;
}

// ========== Booking Models ==========
export interface Booking {
  id: number;
  booking_number: string;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  return_location: string;
  total_days: number;
  price_per_day: number;
  total_price: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  // Additional fields from join queries
  brand?: string;
  model?: string;
  year?: number;
  car_price?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface CreateBookingData {
  car_id: number;
  start_date: string;
  end_date: string;
  pickup_location: string;
  return_location: string;
}

export interface UpdateBookingData {
  start_date: string;
  end_date: string;
  pickup_location: string;
  return_location: string;
}

// ========== Payment Models ==========
export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: 'AGENCY' | 'DELIVERY' | 'STRIPE';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

// ========== Contact Models ==========
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'PENDING' | 'RESOLVED';
  created_at: string;
}

export interface SubmitContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ========== API Response Models ==========
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: { [key: string]: string };
  pagination?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// ========== Dashboard Models ==========
export interface DashboardStats {
  cars: {
    total_cars: number;
    active_cars: number;
    maintenance_cars: number;
  };
  bookings: {
    total_bookings: number;
    confirmed: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
  };
  active_rentals: number;
  total_users: number;
  monthly_revenue: number;
  popular_cars: Array<{
    id: number;
    brand: string;
    model: string;
    booking_count: number;
  }>;
}

// ========== Pagination Models ==========
export interface PaginationOptions {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}
