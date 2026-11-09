import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

type UserEdit = Pick<User, 'first_name' | 'last_name' | 'email' | 'phone' | 'role' | 'status'>;

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [LayoutComponent, CommonModule, FormsModule],
  template: `<app-layout><section class="page"><div class="container"><div class="heading"><div><p class="eyebrow">ADMINISTRATION</p><h1>Gestion des utilisateurs</h1><p>Modifiez les comptes, les rôles et les accès.</p></div></div><div class="alert alert-success" *ngIf="success">{{ success }}</div><div class="alert alert-danger" *ngIf="error">{{ error }}</div><form class="editor" *ngIf="editing" (ngSubmit)="save()"><h2>Modifier le compte</h2><div class="form-grid"><label class="form-label">Prénom<input class="form-control" name="first_name" required minlength="2" [(ngModel)]="form.first_name"></label><label class="form-label">Nom<input class="form-control" name="last_name" required minlength="2" [(ngModel)]="form.last_name"></label><label class="form-label">E-mail<input class="form-control" name="email" type="email" required [(ngModel)]="form.email"></label><label class="form-label">Téléphone<input class="form-control" name="phone" required minlength="8" [(ngModel)]="form.phone"></label><label class="form-label">Rôle<select class="form-control" name="role" [(ngModel)]="form.role"><option value="CLIENT">Client</option><option value="ADMIN">Admin</option></select></label><label class="form-label">État<select class="form-control" name="status" [(ngModel)]="form.status"><option value="ACTIVE">Actif</option><option value="INACTIVE">Désactivé</option><option value="BANNED">Banni</option></select></label></div><div class="actions"><button type="button" class="btn btn-outline" (click)="cancel()">Annuler</button><button class="btn btn-primary" [disabled]="saving">{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</button></div></form><p *ngIf="loading">Chargement des utilisateurs…</p><div class="table-wrap" *ngIf="!loading"><table><thead><tr><th>Utilisateur</th><th>Contact</th><th>Réservations</th><th>Rôle</th><th>État</th><th>Actions</th></tr></thead><tbody><tr *ngFor="let user of users"><td><strong>{{ user.first_name }} {{ user.last_name }}</strong><br><small>#{{ user.id }}</small></td><td>{{ user.email }}<br><small>{{ user.phone }}</small></td><td>{{ user.booking_count || 0 }}</td><td>{{ user.role }}</td><td><span class="status" [class.inactive]="user.status !== 'ACTIVE'">{{ user.status }}</span></td><td class="actions"><button type="button" class="btn btn-secondary btn-sm" (click)="edit(user)">Modifier</button><button *ngIf="user.status === 'ACTIVE' && user.id !== currentUserId" type="button" class="btn btn-danger btn-sm" (click)="deactivate(user)">Désactiver</button></td></tr><tr *ngIf="!users.length"><td colspan="6">Aucun utilisateur trouvé.</td></tr></tbody></table></div></div></section></app-layout>`,
  styles: [`.page{padding:3rem 0}.heading{margin-bottom:1.5rem}.eyebrow{color:var(--color-accent-gold);font-weight:700;margin:0}.table-wrap{overflow:auto;border:1px solid var(--color-gray);border-radius:10px;background:#fff}table{border-collapse:collapse;width:100%;min-width:800px}th,td{padding:1rem;border-bottom:1px solid var(--color-gray);text-align:left;vertical-align:middle}th{background:var(--color-light-gray)}small{color:var(--color-text-muted)}.editor{margin:1.5rem 0;padding:1.5rem;border:1px solid var(--color-gray);border-radius:10px;background:#fff}.editor h2{margin-top:0}.form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.form-label{margin:0}.actions{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.25rem}.status{font-size:.8rem;font-weight:700;color:var(--color-primary-blue)}.status.inactive{color:var(--color-danger)}@media(max-width:700px){.form-grid{grid-template-columns:1fr}}`]
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  editing?: User;
  form: UserEdit = this.emptyForm();
  currentUserId = this.auth.getCurrentUserValue()?.id;
  loading = true;
  saving = false;
  error = '';
  success = '';

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getUsers(1, 100).subscribe({
      next: response => { this.users = (response.data || []) as User[]; this.loading = false; },
      error: response => { this.error = response.error?.message || 'Impossible de charger les utilisateurs.'; this.loading = false; }
    });
  }

  edit(user: User): void {
    this.clearMessages();
    this.editing = user;
    this.form = { first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone || '', role: user.role, status: user.status };
  }

  save(): void {
    if (!this.editing) return;
    this.saving = true;
    this.clearMessages();
    this.api.updateAdminUser(this.editing.id, this.form).subscribe({
      next: () => { this.success = 'Utilisateur modifié.'; this.saving = false; this.editing = undefined; this.load(); },
      error: response => { this.error = response.error?.message || 'Impossible de modifier cet utilisateur.'; this.saving = false; }
    });
  }

  deactivate(user: User): void {
    if (!confirm(`Désactiver le compte de ${user.first_name} ${user.last_name} ?`)) return;
    this.clearMessages();
    this.api.deactivateAdminUser(user.id).subscribe({
      next: () => { this.success = 'Compte désactivé.'; this.load(); },
      error: response => this.error = response.error?.message || 'Impossible de désactiver ce compte.'
    });
  }

  cancel(): void { this.editing = undefined; }
  private emptyForm(): UserEdit { return { first_name: '', last_name: '', email: '', phone: '', role: 'CLIENT', status: 'ACTIVE' }; }
  private clearMessages(): void { this.error = ''; this.success = ''; }
}