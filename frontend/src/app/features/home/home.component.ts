import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Car } from '../../../core/models';
import { carImage, categoryShowcase, handleCarImageError } from '../../core/utils/car-image';
import { rentalLocations } from '../../core/utils/rental-locations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LayoutComponent, CommonModule, RouterLink, FormsModule],
  template: `
    <app-layout>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Votre route commence ici.</h1>
          <p>Louez votre voiture en toute simplicité avec Carthage Drive</p>
          
          <!-- Search Form -->
          <form class="search-form" (ngSubmit)="onSearch()">
            <div class="form-group">
              <label class="form-label">Lieu de récupération</label>
              <input type="text" class="form-control" placeholder="Ex: Tunis Centre" [(ngModel)]="searchFilters.pickup" name="pickup">
            </div>
            <div class="form-group">
              <label class="form-label">Date de récupération</label>
              <input type="date" class="form-control" [(ngModel)]="searchFilters.startDate" name="startDate">
            </div>
            <div class="form-group">
              <label class="form-label">Date de retour</label>
              <input type="date" class="form-control" [(ngModel)]="searchFilters.endDate" name="endDate">
            </div>
            <button type="submit" class="btn btn-secondary">Rechercher une voiture</button>
          </form>
        </div>
      </section>

      <!-- Popular Cars -->
      <section class="popular-cars">
        <div class="container">
          <h2 class="section-title">Nos Voitures Populaires</h2>
          <div class="cars-grid">
            <div *ngFor="let car of popularCars" class="car-card">
              <div class="car-image">
                <img [src]="imageFor(car)" (error)="handleImageError($event)" [alt]="car.brand + ' ' + car.model">
              </div>
              <div class="car-info">
                <h3>{{ car.brand }} {{ car.model }}</h3>
                <div class="car-details">
                  <span>{{ car.year }}</span>
                  <span>{{ car.seats }} places</span>
                  <span>{{ car.transmission }}</span>
                </div>
                <p class="pickup-location">📍 {{ pickupLocations.join(' · ') }}</p>
                <div class="car-price">
                  {{ car.price_per_day | currency:'TND':'DT':'1.0-0':'fr-TN' }} <span>/jour</span>
                </div>
                <div class="car-actions">
                  <a [routerLink]="['/cars', car.id]" class="btn btn-outline btn-sm">
                    Voir détails
                  </a>
                  <a [routerLink]="['/booking', car.id]" class="btn btn-primary btn-sm">
                    Réserver
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-4">
            <a routerLink="/cars" class="btn btn-primary">
              Voir toutes les voitures
            </a>
          </div>
        </div>
      </section>

      <section class="category-showcase">
        <div class="container">
          <h2 class="section-title">Une voiture pour chaque voyage</h2>
          <div class="category-grid">
            <article class="category-card" *ngFor="let item of categoryShowcase">
              <img [src]="item.image" [alt]="item.name">
              <div><h3>{{ item.name }}</h3><p>{{ item.description }}</p></div>
            </article>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">Pourquoi Carthage Drive?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚗</div>
              <h3>Véhicules Premium</h3>
              <p>Flotte de véhicules modernes et bien entretenus</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>Tarifs Transparents</h3>
              <p>Pas de frais cachés, tarification claire</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <h3>Sécurité Maximale</h3>
              <p>Assurance complète et protection totale</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Réservation Rapide</h3>
              <p>Processus simple et rapide en ligne</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <h2>Prêt à réserver votre voiture?</h2>
          <p>Rejoignez des milliers de clients satisfaits en Tunisie</p>
          <a routerLink="/cars" class="btn btn-secondary btn-lg">
            Commencer maintenant
          </a>
        </div>
      </section>
    </app-layout>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-navy) 100%);
      color: var(--color-white);
      padding: var(--spacing-3xl) var(--spacing-md);
      text-align: center;
    }

    .hero-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3rem;
      color: var(--color-white);
      margin-bottom: var(--spacing-md);
    }

    .hero p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: var(--spacing-2xl);
    }

    .search-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      background-color: rgba(255, 255, 255, 0.1);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(10px);
    }

    .search-form .form-group {
      margin: 0;
    }

    .search-form .form-label {
      color: var(--color-white);
      opacity: 0.9;
    }

    .popular-cars {
      padding: var(--spacing-3xl) 0;
      background-color: var(--color-light-gray);
    }

    .section-title {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
      font-size: 2.5rem;
    }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .car-card {
      background-color: var(--color-white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
    }

    .car-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-8px);
    }

    .car-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-color: var(--color-light-gray);
    }

    .car-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-base);
    }

    .car-card:hover .car-image img {
      transform: scale(1.1);
    }

    .car-info {
      padding: var(--spacing-lg);
    }

    .car-info h3 {
      margin-bottom: var(--spacing-sm);
      font-size: 1.25rem;
    }

    .car-details {
      display: flex;
      gap: var(--spacing-md);
      font-size: 0.9rem;
      color: var(--color-dark-gray);
      margin-bottom: var(--spacing-md);
      flex-wrap: wrap;
    }

    .car-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent-gold);
      margin-bottom: var(--spacing-md);
    }

    .car-price span {
      font-size: 0.9rem;
      font-weight: 400;
    }

    .pickup-location {
      margin: 0 0 var(--spacing-md);
      color: var(--color-dark-gray);
      font-size: 0.82rem;
    }

    .car-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .car-actions .btn {
      flex: 1;
      font-size: 0.85rem;
      padding: var(--spacing-sm);
    }

    .features {
      padding: var(--spacing-3xl) 0;
    }

    .category-showcase { padding: var(--spacing-3xl) 0; background: var(--color-white); }
    .category-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:var(--spacing-lg); }
    .category-card { border-radius:var(--radius-lg); overflow:hidden; background:var(--color-light-gray); box-shadow:var(--shadow-sm); }
    .category-card img { display:block; width:100%; height:190px; object-fit:cover; }
    .category-card div { padding:var(--spacing-lg); }
    .category-card h3 { margin:0 0 var(--spacing-sm); }
    .category-card p { margin:0; color:var(--color-dark-gray); }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-2xl);
    }

    .feature-card {
      text-align: center;
      padding: var(--spacing-2xl) var(--spacing-lg);
      border-radius: var(--radius-lg);
      background-color: var(--color-light-gray);
      transition: all var(--transition-base);
    }

    .feature-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .feature-card h3 {
      margin-bottom: var(--spacing-md);
    }

    .feature-card p {
      margin: 0;
    }

    .cta {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-blue) 100%);
      color: var(--color-white);
      padding: var(--spacing-3xl) 0;
      text-align: center;
    }

    .cta h2 {
      color: var(--color-white);
      font-size: 2.5rem;
      margin-bottom: var(--spacing-md);
    }

    .cta p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      margin-bottom: var(--spacing-2xl);
    }

    @media (max-width: 768px) {
      .hero {
        padding: var(--spacing-2xl) var(--spacing-md);
      }

      .hero h1 {
        font-size: 1.75rem;
      }

      .hero p {
        font-size: 1rem;
      }

      .search-form {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .cars-grid {
        grid-template-columns: 1fr;
      }

      .category-grid { grid-template-columns:1fr 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularCars: Car[] = [];
  categoryShowcase = categoryShowcase;
  pickupLocations = rentalLocations;
  searchFilters = {
    pickup: '',
    startDate: '',
    endDate: ''
  };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadPopularCars();
  }

  loadPopularCars(): void {
    this.apiService.getCars({}, { sort: 'price_per_day', order: 'ASC', page: 1, per_page: 6 })
      .subscribe({
        next: (response: { data?: Car[] }) => {
          this.popularCars = response.data || [];
        },
        error: (error: unknown) => {
          console.error('Error loading cars:', error);
        }
      });
  }

  imageFor(car: Car): string {
    return carImage(car.category, car.images?.[0]?.image_url, car.brand, car.model);
  }

  handleImageError(event: Event): void {
    handleCarImageError(event);
  }

  onSearch(): void {
    this.router.navigate(['/cars'], { queryParams: this.searchFilters });
  }
}
