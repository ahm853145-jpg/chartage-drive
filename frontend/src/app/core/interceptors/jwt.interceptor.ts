import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * JWT Interceptor
 * Adds authentication token to all HTTP requests
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    // Clone request and add authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(catchError(error => {
    if (error.status === 401) {
      authService.clearAuth();
      if (!router.url.startsWith('/auth/login')) {
        router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
      }
    }
    return throwError(() => error);
  }));
};
