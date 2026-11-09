import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard', standalone: true, imports: [LayoutComponent, CommonModule, RouterLink],
  template: `<app-layout><section class="page"><div class="container"><p class="eyebrow">ADMINISTRATION</p><h1>Tableau de bord</h1><div class="stats" *ngIf="stats"><div><span>Véhicules actifs</span><strong>{{ stats.cars.active_cars }}</strong></div><div><span>Réservations</span><strong>{{ stats.bookings.total_bookings }}</strong></div><div><span>Locations en cours</span><strong>{{ stats.active_rentals }}</strong></div><div><span>Revenu mensuel</span><strong>{{ stats.monthly_revenue | currency:'TND':'DT':'1.0-0':'fr-TN' }}</strong></div></div><div class="actions"><a routerLink="/admin/cars" class="btn btn-primary">Gérer la flotte</a><a routerLink="/admin/bookings" class="btn btn-outline">Gérer les réservations</a><a routerLink="/admin/users" class="btn btn-outline">Utilisateurs</a></div></div></section></app-layout>`,
  styles: [`.page{padding:3rem 0}.eyebrow{font-weight:700;color:var(--color-accent-gold)}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin:2rem 0}.stats div{padding:1.5rem;background:var(--color-light-gray);border-radius:10px}.stats strong{display:block;font-size:1.8rem;color:var(--color-primary-dark)}.actions{display:flex;flex-wrap:wrap;gap:1rem}@media(max-width:700px){.stats{grid-template-columns:1fr 1fr}}`]
})
export class AdminDashboardComponent implements OnInit {
  stats?: DashboardStats;
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.api.getAdminDashboard().subscribe(response => this.stats = response.data); }
}
