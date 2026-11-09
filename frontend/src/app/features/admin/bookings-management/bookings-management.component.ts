import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { Booking, Car } from '../../../core/models';

type BookingEdit = Pick<Booking, 'car_id' | 'start_date' | 'end_date' | 'pickup_location' | 'return_location' | 'status'>;

@Component({
  selector: 'app-bookings-management',
  standalone: true,
  imports: [LayoutComponent, CommonModule, FormsModule],
  template: `<app-layout><section class="page"><div class="container"><div class="heading"><div><p class="eyebrow">ADMINISTRATION</p><h1>Gestion des réservations</h1><p>Modifiez les détails, le véhicule ou l’état des réservations.</p></div></div><div class="alert alert-success" *ngIf="success">{{ success }}</div><div class="alert alert-danger" *ngIf="error">{{ error }}</div><form class="editor" *ngIf="editing" (ngSubmit)="save()"><div class="editor-header"><div><h2>Modifier {{ editing.booking_number }}</h2><p>{{ editing.first_name }} {{ editing.last_name }} · {{ editing.email }}</p></div><button type="button" class="btn btn-outline btn-sm" (click)="cancel()">Fermer</button></div><div class="form-grid"><label class="form-label wide">Véhicule<select class="form-control" name="car_id" required [(ngModel)]="form.car_id"><option *ngFor="let car of cars" [ngValue]="car.id">{{ car.brand }} {{ car.model }} · {{ car.price_per_day | number:'1.0-2' }} DT/jour</option></select></label><label class="form-label">Date de départ<input class="form-control" type="date" name="start_date" required [(ngModel)]="form.start_date"></label><label class="form-label">Date de retour<input class="form-control" type="date" name="end_date" required [(ngModel)]="form.end_date"></label><label class="form-label">Lieu de récupération<input class="form-control" name="pickup_location" required minlength="2" [(ngModel)]="form.pickup_location"></label><label class="form-label">Lieu de retour<input class="form-control" name="return_location" required minlength="2" [(ngModel)]="form.return_location"></label><label class="form-label">État<select class="form-control" name="status" [(ngModel)]="form.status"><option *ngFor="let item of statuses" [value]="item">{{ item }}</option></select></label></div><p class="hint">Le prix total est recalculé automatiquement selon le véhicule et la durée. Une réservation confirmée ou en cours ne peut pas se chevaucher avec une autre.</p><div class="actions"><button type="button" class="btn btn-outline" (click)="cancel()">Annuler</button><button class="btn btn-primary" [disabled]="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer la réservation' }}</button></div></form><div class="filters"><label class="form-label">Filtrer par état<select class="form-control" [(ngModel)]="status" name="filter_status" (change)="load()"><option value="">Tous les statuts</option><option *ngFor="let item of statuses" [value]="item">{{ item }}</option></select></label></div><p *ngIf="loading">Chargement des réservations…</p><div class="table-wrap" *ngIf="!loading"><table><thead><tr><th>Référence</th><th>Client</th><th>Véhicule</th><th>Dates</th><th>Montant</th><th>État</th><th>Actions</th></tr></thead><tbody><tr *ngFor="let booking of bookings"><td><strong>{{ booking.booking_number }}</strong></td><td>{{ booking.first_name }} {{ booking.last_name }}<br><small>{{ booking.email }}</small></td><td>{{ booking.brand }} {{ booking.model }}</td><td>{{ booking.start_date | date:'dd/MM/yyyy' }} — {{ booking.end_date | date:'dd/MM/yyyy' }}</td><td>{{ booking.total_price | currency:'TND':'DT':'1.0-2':'fr-TN' }}</td><td><span class="status">{{ booking.status }}</span></td><td><button type="button" class="btn btn-secondary btn-sm" (click)="edit(booking)">Modifier</button></td></tr><tr *ngIf="!bookings.length"><td colspan="7">Aucune réservation trouvée.</td></tr></tbody></table></div></div></section></app-layout>`,
  styles: [`.page{padding:3rem 0}.heading{margin-bottom:1.5rem}.eyebrow{color:var(--color-accent-gold);font-weight:700;margin:0}.filters{max-width:320px;margin:1.5rem 0}.editor{margin:1.5rem 0;padding:1.5rem;border:1px solid var(--color-gray);border-radius:10px;background:#fff}.editor-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}.editor-header h2{margin:0}.editor-header p{margin:.5rem 0 1.25rem;color:var(--color-text-muted)}.form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.form-label{margin:0}.wide{grid-column:span 2}.hint{margin:1rem 0 0;color:var(--color-text-muted);font-size:.9rem}.actions{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.25rem}.table-wrap{overflow:auto;border:1px solid var(--color-gray);border-radius:10px;background:#fff}table{border-collapse:collapse;width:100%;min-width:1000px}th,td{padding:1rem;border-bottom:1px solid var(--color-gray);text-align:left;vertical-align:middle}th{background:var(--color-light-gray)}small{color:var(--color-text-muted)}.status{font-size:.8rem;font-weight:700;color:var(--color-primary-blue)}@media(max-width:700px){.form-grid{grid-template-columns:1fr}.wide{grid-column:auto}.editor-header{flex-direction:column}}`]
})
export class BookingsManagementComponent implements OnInit {
  bookings: Booking[] = [];
  cars: Car[] = [];
  statuses: Booking['status'][] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  status = '';
  editing?: Booking;
  form: BookingEdit = this.emptyForm();
  loading = true;
  saving = false;
  error = '';
  success = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getCars({}, { sort: 'brand', order: 'ASC', per_page: 100 }).subscribe({
      next: response => this.cars = response.data || [],
      error: response => this.error = response.error?.message || 'Impossible de charger les véhicules.'
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAllBookings(1, 100, this.status).subscribe({
      next: response => { this.bookings = response.data || []; this.loading = false; },
      error: response => { this.error = response.error?.message || 'Impossible de charger les réservations.'; this.loading = false; }
    });
  }

  edit(booking: Booking): void {
    this.clearMessages();
    this.editing = booking;
    this.form = {
      car_id: booking.car_id,
      start_date: booking.start_date.slice(0, 10),
      end_date: booking.end_date.slice(0, 10),
      pickup_location: booking.pickup_location,
      return_location: booking.return_location,
      status: booking.status
    };
  }

  save(): void {
    if (!this.editing) return;
    this.saving = true;
    this.clearMessages();
    this.api.updateAdminBooking(this.editing.id, this.form).subscribe({
      next: () => { this.success = 'Réservation mise à jour.'; this.saving = false; this.editing = undefined; this.load(); },
      error: response => { this.error = response.error?.message || 'Impossible de modifier cette réservation.'; this.saving = false; }
    });
  }

  cancel(): void { this.editing = undefined; }
  private emptyForm(): BookingEdit { return { car_id: 0, start_date: '', end_date: '', pickup_location: '', return_location: '', status: 'PENDING' }; }
  private clearMessages(): void { this.error = ''; this.success = ''; }
}