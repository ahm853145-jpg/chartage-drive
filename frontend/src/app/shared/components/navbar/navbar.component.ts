import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <span class="logo-text">CARTHAGE DRIVE</span>
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="navbar-menu">
          <div class="navbar-start">
            <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="navbar-item">
              Accueil
            </a>
            <a routerLink="/cars" routerLinkActive="active" class="navbar-item">
              Nos voitures
            </a>
            <a routerLink="/about" routerLinkActive="active" class="navbar-item">
              À propos
            </a>
            <a routerLink="/contact" routerLinkActive="active" class="navbar-item">
              Contact
            </a>
          </div>

          <div class="navbar-end">
            <ng-container *ngIf="!(isAuthenticated$ | async); else userMenu">
              <a routerLink="/auth/login" class="navbar-item">
                Se connecter
              </a>
              <a routerLink="/auth/register" class="btn btn-secondary btn-sm">
                Créer un compte
              </a>
            </ng-container>

            <ng-template #userMenu>
              <div class="navbar-item dropdown">
                <span class="dropdown-toggle">{{ (currentUser$ | async)?.first_name }} {{ (currentUser$ | async)?.last_name }}</span>
                <div class="dropdown-menu">
                  <ng-container *ngIf="(currentUser$ | async)?.role === 'ADMIN'; else clientMenu">
                    <a routerLink="/admin/dashboard" class="dropdown-item">
                      Dashboard Admin
                    </a>
                    <a routerLink="/admin/cars" class="dropdown-item">
                      Gérer les voitures
                    </a>
                    <a routerLink="/admin/bookings" class="dropdown-item">
                      Gérer les réservations
                    </a>
                    <a routerLink="/admin/users" class="dropdown-item">
                      Gérer les utilisateurs
                    </a>
                  </ng-container>

                  <ng-template #clientMenu>
                    <a routerLink="/client/dashboard" class="dropdown-item">
                      Mon compte
                    </a>
                    <a routerLink="/client/reservations" class="dropdown-item">
                      Mes réservations
                    </a>
                    <a routerLink="/client/profile" class="dropdown-item">
                      Mon profil
                    </a>
                  </ng-template>

                  <div class="dropdown-divider"></div>
                  <button (click)="logout()" class="dropdown-item logout-btn">
                    Déconnexion
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="navbar-toggle" (click)="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--color-primary-dark);
      color: var(--color-white);
      padding: var(--spacing-md) 0;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      box-shadow: var(--shadow-md);
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      color: var(--color-white);
      font-weight: 700;
      font-size: 1.25rem;
      transition: color var(--transition-base);
    }

    .logo:hover {
      color: var(--color-accent-gold);
    }

    .logo-text {
      letter-spacing: 1px;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-2xl);
      flex: 1;
      margin-left: var(--spacing-2xl);
    }

    .navbar-start {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
    }

    .navbar-end {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
      margin-left: auto;
    }

    .navbar-item {
      color: var(--color-white);
      text-decoration: none;
      font-weight: 500;
      transition: color var(--transition-base);
      position: relative;
    }

    .navbar-item:hover {
      color: var(--color-accent-gold);
    }

    .navbar-item.active {
      color: var(--color-accent-gold);
    }

    .navbar-item.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--color-accent-gold);
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .dropdown-toggle::after {
      content: '▼';
      font-size: 0.65rem;
      transition: transform var(--transition-base);
    }

    .dropdown:hover .dropdown-toggle::after {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--color-white);
      color: var(--color-text-dark);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all var(--transition-base);
      margin-top: var(--spacing-md);
    }

    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-lg);
      text-align: left;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--color-text-dark);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .dropdown-item:hover {
      background-color: var(--color-light-gray);
      color: var(--color-primary-dark);
    }

    .dropdown-divider {
      height: 1px;
      background-color: var(--color-gray);
      margin: var(--spacing-sm) 0;
    }

    .logout-btn {
      color: var(--color-danger);
    }

    .logout-btn:hover {
      background-color: rgba(231, 76, 60, 0.1);
    }

    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--color-white);
      cursor: pointer;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .navbar-toggle span {
      width: 25px;
      height: 3px;
      background-color: var(--color-white);
      transition: all var(--transition-base);
    }

    @media (max-width: 768px) {
      .navbar-toggle {
        display: flex;
      }

      .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--color-primary-dark);
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        max-height: 0;
        overflow: hidden;
        transition: max-height var(--transition-base);
      }

      .navbar-menu.active {
        max-height: 500px;
      }

      .navbar-start {
        flex-direction: column;
        width: 100%;
        gap: var(--spacing-sm);
      }

      .navbar-end {
        flex-direction: column;
        width: 100%;
        margin-left: 0;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleMobileMenu(): void {
    const menu = document.querySelector('.navbar-menu');
    menu?.classList.toggle('active');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => { this.authService.clearAuth(); this.router.navigate(['/home']); }
    });
  }
}

// Pipe to get user full name
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFullName',
  standalone: true
})
export class UserFullNamePipe implements PipeTransform {
  transform(user: User | null): string {
    if (!user) return '';
    return `${user.first_name} ${user.last_name}`;
  }
}
