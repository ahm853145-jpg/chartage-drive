import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-booking-confirmation', standalone: true, imports: [LayoutComponent, CommonModule, RouterLink],
  template: `<app-layout><section class="confirmation"><div class="container"><div class="card" *ngIf="booking"><div class="card-body"><div class="check">✓</div><h1>Demande envoyée</h1><p>Votre réservation a bien été enregistrée. Nous vous contacterons pour la confirmer.</p><div class="summary"><span>Référence</span><strong>{{ booking.booking_number }}</strong><span>Véhicule</span><strong>{{ booking.brand }} {{ booking.model }}</strong><span>Période</span><strong>{{ booking.start_date | date:'dd/MM/yyyy' }} — {{ booking.end_date | date:'dd/MM/yyyy' }}</strong><span>Total</span><strong>{{ booking.total_price | currency:'TND':'DT':'1.0-0':'fr-TN' }}</strong></div><a class="btn btn-primary" routerLink="/client/reservations">Voir mes réservations</a></div></div></div></section></app-layout>`,
  styles: [`.confirmation{padding:4rem 1rem}.card{max-width:620px;margin:auto;text-align:center}.check{width:64px;height:64px;margin:0 auto 1rem;border-radius:50%;background:var(--color-success);color:#fff;font-size:2.4rem}.summary{display:grid;grid-template-columns:1fr 1fr;gap:1rem;text-align:left;padding:1.5rem;background:var(--color-light-gray);margin:2rem 0;border-radius:8px}.summary strong{text-align:right}`]
})
export class BookingConfirmationComponent implements OnInit {
  booking?: Booking;
  constructor(private route: ActivatedRoute, private api: ApiService) {}
  ngOnInit(): void { this.api.getBookingById(Number(this.route.snapshot.paramMap.get('id'))).subscribe(response => this.booking = response.data); }
}
