import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, Booking, User, Payment, ContactMessage, ApiResponse, CarFilter, CarSort, CreateBookingData, UpdateBookingData, SubmitContactData, DashboardStats } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly formHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  constructor(private http: HttpClient) {}

  // ========== CAR ENDPOINTS ==========

  /**
   * Get all cars with filters
   */
  getCars(filter?: CarFilter, sort?: CarSort): Observable<ApiResponse<Car[]>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.brand) params = params.set('brand', filter.brand);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.price_min !== undefined) params = params.set('price_min', filter.price_min.toString());
      if (filter.price_max !== undefined) params = params.set('price_max', filter.price_max.toString());
      if (filter.fuel_type) params = params.set('fuel_type', filter.fuel_type);
      if (filter.transmission) params = params.set('transmission', filter.transmission);
      if (filter.seats !== undefined) params = params.set('seats', filter.seats.toString());
    }

    if (sort) {
      if (sort.sort) params = params.set('sort', sort.sort);
      if (sort.order) params = params.set('order', sort.order);
      if (sort.page !== undefined) params = params.set('page', sort.page.toString());
      if (sort.per_page !== undefined) params = params.set('per_page', sort.per_page.toString());
    }

    return this.http.get<ApiResponse<Car[]>>(`${this.apiUrl}/cars`, { params });
  }

  /**
   * Get car by ID
   */
  getCarById(id: number): Observable<ApiResponse<Car>> {
    return this.http.get<ApiResponse<Car>>(`${this.apiUrl}/cars/${id}`);
  }

  /**
   * Create car (admin only)
   */
  createCar(data: Partial<Car>): Observable<ApiResponse<Car>> {
    return this.http.post<ApiResponse<Car>>(`${this.apiUrl}/cars`, this.formBody(data), { headers: this.formHeaders });
  }

  /**
   * Update car (admin only)
   */
  updateCar(id: number, data: Partial<Car>): Observable<ApiResponse<Car>> {
    return this.http.put<ApiResponse<Car>>(`${this.apiUrl}/cars/${id}`, this.formBody(data), { headers: this.formHeaders });
  }

  /**
   * Delete car (admin only)
   */
  deleteCar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/cars/${id}`);
  }

  // ========== BOOKING ENDPOINTS ==========

  /**
   * Get user's bookings
   */
  getBookings(page: number = 1, perPage: number = 10): Observable<ApiResponse<Booking[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/bookings`, { params });
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/bookings/${id}`);
  }

  /**
   * Create booking
   */
  createBooking(data: CreateBookingData): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.apiUrl}/bookings`, this.formBody(data), { headers: this.formHeaders });
  }

  /**
   * Update booking
   */
  updateBooking(id: number, data: UpdateBookingData): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.apiUrl}/bookings/${id}`, this.formBody(data), { headers: this.formHeaders });
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/bookings/${id}`);
  }

  // ========== USER ENDPOINTS ==========

  /**
   * Get user profile
   */
  getUserProfile(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Update user profile
   */
  updateUserProfile(id: number, data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/users/${id}`, this.formBody(data), { headers: this.formHeaders });
  }

  /**
   * Change password
   */
  changePassword(id: number, currentPassword: string, newPassword: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/users/${id}/password`, this.formBody({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPassword
    }), { headers: this.formHeaders });
  }

  private formBody(data: object): HttpParams {
    return Object.entries(data).reduce((params, [key, value]) => value === null || value === undefined ? params : params.set(key, String(value)), new HttpParams());
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get admin dashboard statistics
   */
  getAdminDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/admin/dashboard`);
  }

  /**
   * Get all users (admin)
   */
  getUsers(page: number = 1, perPage: number = 10): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/admin/users`, { params });
  }

  updateAdminUser(id: number, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/admin/users/${id}`, this.formBody(data), { headers: this.formHeaders });
  }

  deactivateAdminUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/admin/users/${id}`);
  }

  /**
   * Get all bookings (admin)
   */
  getAllBookings(page: number = 1, perPage: number = 10, status?: string): Observable<ApiResponse<Booking[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/admin/bookings`, { params });
  }

  updateAdminBooking(id: number, data: Pick<Booking, 'car_id' | 'start_date' | 'end_date' | 'pickup_location' | 'return_location' | 'status'>): Observable<ApiResponse<Booking>> {
    return this.http.put<ApiResponse<Booking>>(`${this.apiUrl}/admin/bookings/${id}`, this.formBody(data), { headers: this.formHeaders });
  }

  // ========== CONTACT ENDPOINTS ==========

  /**
   * Submit contact form
   */
  submitContact(data: SubmitContactData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/contact`, data);
  }
}
