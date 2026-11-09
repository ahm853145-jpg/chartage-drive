import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthCredentials, RegisterData, LoginResponse, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'carthage_drive_token';
  private userKey = 'carthage_drive_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private initializeAuth(): void {
    if (this.hasToken()) {
      const user = this.getCurrentUser();
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  /**
   * Register new user
   */
  register(data: RegisterData): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, data);
  }

  /**
   * Login user
   */
  login(credentials: AuthCredentials): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data?.token) {
            this.setToken(response.data.token);
            const user: User = {
              id: response.data.id,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email,
              phone: response.data.phone,
              role: response.data.role,
              status: 'ACTIVE',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            this.setCurrentUser(user);
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.clearAuth())
      );
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user has valid token
   */
  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Set current user
   */
  setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get current user value (sync)
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.getCurrentUserValue()?.role === 'ADMIN';
  }

  /**
   * Check if user is client
   */
  isClient(): boolean {
    return this.getCurrentUserValue()?.role === 'CLIENT';
  }

  /**
   * Get user full name
   */
  getUserFullName(): string {
    const user = this.getCurrentUserValue();
    return user ? `${user.first_name} ${user.last_name}` : '';
  }
}
