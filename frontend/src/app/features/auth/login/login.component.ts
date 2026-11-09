import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LayoutComponent, CommonModule, FormsModule, RouterLink],
  template: `<app-layout><section class="auth-page"><div class="auth-card"><h1>Connexion</h1><p>Accédez à vos réservations et à votre profil.</p><div class="alert alert-danger" *ngIf="error">{{ error }}</div><form (ngSubmit)="submit()"><label class="form-label">E-mail<input class="form-control" type="email" required [(ngModel)]="email" name="email"></label><label class="form-label">Mot de passe<input class="form-control" type="password" required minlength="6" [(ngModel)]="password" name="password"></label><button type="submit" class="btn btn-primary w-100" [disabled]="loading">{{ loading ? 'Connexion...' : 'Se connecter' }}</button></form><p class="links"><a routerLink="/auth/forgot-password">Mot de passe oublié ?</a><a routerLink="/auth/register">Créer un compte</a></p></div></section></app-layout>`,
  styles: [`.auth-page{padding:4rem 1rem}.auth-card{max-width:460px;margin:auto;padding:2rem;border:1px solid var(--color-gray);border-radius:12px;box-shadow:var(--shadow-md)}.form-label{margin-top:1rem}.links{display:flex;justify-content:space-between;margin-top:1rem}`]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  submit(): void {
    this.loading = true;
    this.error = '';
    this.auth.login({ email: this.email.trim(), password: this.password }).pipe(finalize(() => this.loading = false)).subscribe({
      next: response => {
        const role = response.data?.role;
        const fallback = role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard';
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const isAllowedReturnUrl = returnUrl && ((role === 'ADMIN' && returnUrl.startsWith('/admin')) || (role === 'CLIENT' && returnUrl.startsWith('/client')) || returnUrl.startsWith('/booking'));
        this.router.navigateByUrl(isAllowedReturnUrl ? returnUrl : fallback);
      },
      error: error => this.error = this.getErrorMessage(error)
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Impossible de joindre le serveur. Vérifiez qu’Apache est démarré.';
    if (error.status === 401) return 'E-mail ou mot de passe incorrect.';
    return error.error?.message || 'La connexion a échoué. Réessayez.';
  }
}
