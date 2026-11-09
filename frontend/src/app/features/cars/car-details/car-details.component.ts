import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { Car } from '../../../core/models';
import { carImage, handleCarImageError } from '../../../core/utils/car-image';
import { rentalLocations } from '../../../core/utils/rental-locations';

@Component({
  selector: 'app-car-details', standalone: true, imports: [LayoutComponent, CommonModule, RouterLink],
  template: `<app-layout><section class="details"><div class="container" *ngIf="car; else loading"><a routerLink="/cars">← Retour à la flotte</a><div class="grid"><img class="hero-img" [src]="imageFor(car)" (error)="handleImageError($event)" [alt]="car.brand + ' ' + car.model"><div><p class="eyebrow">{{ car.category }}</p><h1>{{ car.brand }} {{ car.model }}</h1><p>{{ car.description || 'Un véhicule fiable et entretenu, prêt pour votre prochain trajet.' }}</p><div class="specs"><span>📅 {{ car.year }}</span><span>⚙️ {{ car.transmission }}</span><span>⛽ {{ car.fuel_type }}</span><span>👥 {{ car.seats }} places</span><span>🚪 {{ car.doors }} portes</span></div><p class="pickup">📍 Lieux de prise en charge : {{ pickupLocations.join(' · ') }}</p><div class="price">{{ car.price_per_day | currency:'TND':'DT':'1.0-0':'fr-TN' }} <small>par jour</small></div><a class="btn btn-secondary btn-lg" [routerLink]="['/booking', car.id]">Réserver ce véhicule</a></div></div></div><ng-template #loading><div class="container"><p>Chargement du véhicule…</p></div></ng-template></section></app-layout>`,
  styles: [`.details{padding:3rem 0}.grid{display:grid;grid-template-columns:1.2fr 1fr;gap:3rem;margin-top:1.5rem}.hero-img{width:100%;height:390px;object-fit:cover;border-radius:12px;background:#edf0f4}.eyebrow{color:var(--color-accent-orange);font-weight:700}.specs{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin:2rem 0}.pickup{color:#596579;margin:1.5rem 0}.price{font-size:2rem;font-weight:700;color:var(--color-primary-dark);margin-bottom:1.5rem}.price small{font-size:1rem;font-weight:400}@media(max-width:700px){.grid{grid-template-columns:1fr;gap:1.5rem}.hero-img{height:250px}}`]
})
export class CarDetailsComponent implements OnInit {
  car?: Car;
  pickupLocations = rentalLocations;
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  imageFor(car: Car): string { return carImage(car.category, car.images?.[0]?.image_url, car.brand, car.model); }
  handleImageError(event: Event): void { handleCarImageError(event); }
  ngOnInit(): void { const id = Number(this.route.snapshot.paramMap.get('id')); this.api.getCarById(id).subscribe(response => this.car = response.data); }
}
