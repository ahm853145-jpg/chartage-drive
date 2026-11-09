import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { Car } from '../../../core/models';
import { carImage, handleCarImageError } from '../../../core/utils/car-image';
import { rentalLocations } from '../../../core/utils/rental-locations';

@Component({
  selector: 'app-cars-list', standalone: true, imports: [LayoutComponent, CommonModule, FormsModule, RouterLink],
  template: `<app-layout><section class="catalog"><div class="container"><div class="heading"><div><p class="eyebrow">NOTRE FLOTTE</p><h1>Nos voitures</h1><p>Trouvez le véhicule adapté à votre voyage en Tunisie.</p></div></div><div class="filters"><input class="form-control" placeholder="Rechercher une marque ou un modèle" [(ngModel)]="search" (ngModelChange)="apply()"><select class="form-control" [(ngModel)]="category" (change)="load()"><option value="">Toutes catégories</option><option *ngFor="let item of categories" [value]="item">{{item}}</option></select><select class="form-control" [(ngModel)]="sort" (change)="load()"><option value="price_per_day">Prix croissant</option><option value="year">Plus récentes</option></select></div><p *ngIf="loading">Chargement de la flotte…</p><div class="cars" *ngIf="!loading"><article class="car" *ngFor="let car of filtered"><img [src]="imageFor(car)" (error)="handleImageError($event)" [alt]="car.brand + ' ' + car.model"><div><span class="tag">{{car.category}}</span><h2>{{car.brand}} {{car.model}}</h2><p>{{car.year}} · {{car.transmission}} · {{car.fuel_type}} · {{car.seats}} places</p><p class="pickup">📍 Prise en charge : {{pickupLocations.join(' · ')}}</p><strong>{{car.price_per_day | currency:'TND':'DT':'1.0-0':'fr-TN'}} <small>/ jour</small></strong><a class="btn btn-primary" [routerLink]="['/cars',car.id]">Voir le véhicule</a></div></article><p *ngIf="!filtered.length">Aucun véhicule ne correspond à votre recherche.</p></div></div></section></app-layout>`,
  styles: [`.catalog{padding:3rem 0}.heading{display:flex;justify-content:space-between}.eyebrow{color:var(--color-accent-gold);font-weight:700;margin:0}.filters{display:grid;grid-template-columns:2fr 1fr 1fr;gap:1rem;padding:1.25rem;background:var(--color-light-gray);border-radius:12px;margin:2rem 0}.cars{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}.car{border:1px solid var(--color-gray);border-radius:12px;overflow:hidden;background:#fff}.car img{width:100%;height:190px;object-fit:cover;background:#e8ebf1}.car div{padding:1.25rem}.car h2{font-size:1.25rem;margin:.5rem 0}.car strong{font-size:1.35rem;color:var(--color-primary-dark);display:block;margin:1rem 0}.car .pickup{font-size:.82rem;color:#596579;margin:.7rem 0}.car .btn{width:100%}.tag{color:var(--color-accent-orange);font-size:.8rem;font-weight:700}@media(max-width:700px){.filters{grid-template-columns:1fr}}`]
})
export class CarsListComponent implements OnInit {
  cars: Car[] = []; filtered: Car[] = []; loading = true; search = ''; category = ''; sort = 'price_per_day';
  pickupLocations = rentalLocations;
  get categories(): string[] { return [...new Set(this.cars.map(car => car.category))]; }
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  imageFor(car: Car): string { return carImage(car.category, car.images?.[0]?.image_url, car.brand, car.model); }
  handleImageError(event: Event): void { handleCarImageError(event); }
  load(): void { this.loading = true; this.api.getCars(this.category ? { category: this.category } : {}, { sort: this.sort, order: 'ASC', per_page: 100 }).subscribe({ next: response => { this.cars = response.data || []; this.apply(); this.loading = false; }, error: () => this.loading = false }); }
  apply(): void { const needle = this.search.toLowerCase(); this.filtered = this.cars.filter(car => `${car.brand} ${car.model} ${car.category}`.toLowerCase().includes(needle)); }
}
