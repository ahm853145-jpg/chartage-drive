import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-reservations', standalone: true, imports: [LayoutComponent, CommonModule, RouterLink],
  template: `<app-layout><section class="page"><div class="container"><div class="title"><div><p class="eyebrow">ESPACE CLIENT</p><h1>Mes réservations</h1></div><a class="btn btn-primary" routerLink="/cars">Nouvelle réservation</a></div><p *ngIf="loading">Chargement…</p><div class="table-wrap" *ngIf="!loading"><table><thead><tr><th>Référence</th><th>Véhicule</th><th>Période</th><th>Total</th><th>Statut</th><th></th></tr></thead><tbody><tr *ngFor="let booking of bookings"><td>{{ booking.booking_number }}</td><td>{{ booking.brand }} {{ booking.model }}</td><td>{{ booking.start_date | date:'dd/MM/yyyy' }}<br>{{ booking.end_date | date:'dd/MM/yyyy' }}</td><td>{{ booking.total_price | currency:'TND':'DT':'1.0-0':'fr-TN' }}</td><td><span class="status">{{ booking.status }}</span></td><td><button class="btn btn-danger btn-sm" *ngIf="booking.status === 'PENDING'" (click)="cancel(booking)">Annuler</button></td></tr></tbody></table><p *ngIf="!bookings.length">Vous n’avez encore aucune réservation.</p></div></div></section></app-layout>`,
  styles: [`.page{padding:3rem 0}.title{display:flex;justify-content:space-between;align-items:center}.eyebrow{color:var(--color-accent-gold);font-weight:700}.table-wrap{overflow:auto;border:1px solid var(--color-gray);border-radius:10px}table{width:100%;border-collapse:collapse}th,td{padding:1rem;text-align:left;border-bottom:1px solid var(--color-gray)}th{background:var(--color-light-gray)}.status{font-size:.8rem;font-weight:bold;color:var(--color-primary-blue)}`]
})
export class ReservationsComponent implements OnInit {
  bookings: Booking[] = []; loading = true;
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getBookings(1, 50).subscribe({ next: response => { this.bookings = response.data || []; this.loading = false; }, error: () => this.loading = false }); }
  cancel(booking: Booking): void { if (confirm('Annuler cette réservation ?')) this.api.cancelBooking(booking.id).subscribe(() => this.load()); }
}
