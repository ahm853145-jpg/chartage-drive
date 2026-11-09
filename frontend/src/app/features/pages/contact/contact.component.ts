import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [LayoutComponent, CommonModule, FormsModule],
  template: `
    <app-layout>
      <section class="contact">
        <div class="container">
          <h1>Nous contacter</h1>
          <div class="contact-wrapper">
            <!-- Contact Form -->
            <div class="contact-form">
              <h2>Formulaire de contact</h2>
              
              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>
              
              <div *ngIf="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <form (ngSubmit)="submitForm()">
                <div class="form-group">
                  <label class="form-label">Nom</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.name" name="name" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="formData.email" name="email" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Téléphone</label>
                  <input type="tel" class="form-control" [(ngModel)]="formData.phone" name="phone">
                </div>

                <div class="form-group">
                  <label class="form-label">Sujet</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.subject" name="subject" required>
                </div>

                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea class="form-control" [(ngModel)]="formData.message" name="message" rows="6" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="isLoading">
                  {{ isLoading ? 'Envoi en cours...' : 'Envoyer' }}
                </button>
              </form>
            </div>

            <!-- Contact Info -->
            <div class="contact-info">
              <h2>Nos coordonnées</h2>
              
              <div class="info-item">
                <h3>📞 Téléphone</h3>
                <p>
                  <a href="tel:+216 95 123 456">+216 95 123 456</a>
                </p>
              </div>

              <div class="info-item">
                <h3>✉️ Email</h3>
                <p>
                  <a href="mailto:contact@carthagedrive.tn">contact@carthagedrive.tn</a>
                </p>
              </div>

              <div class="info-item">
                <h3>📍 Adresse</h3>
                <p>
                  Tunis<br/>
                  Tunisie
                </p>
              </div>

              <div class="info-item">
                <h3>🕐 Horaires</h3>
                <p>
                  Lundi - Vendredi: 08:00 - 18:00<br/>
                  Samedi: 09:00 - 17:00<br/>
                  Dimanche: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </app-layout>
  `,
  styles: [`
    .contact {
      padding: var(--spacing-3xl) 0;
      background-color: var(--color-light-gray);
    }

    .contact h1 {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .contact-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2xl);
    }

    .contact-form,
    .contact-info {
      background-color: var(--color-white);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .contact-form h2,
    .contact-info h2 {
      margin-top: 0;
      color: var(--color-primary-dark);
    }

    .info-item {
      margin-bottom: var(--spacing-2xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--color-gray);
    }

    .info-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .info-item h3 {
      margin: 0 0 var(--spacing-sm) 0;
      color: var(--color-accent-gold);
      font-size: 1.1rem;
    }

    .info-item p {
      margin: 0;
    }

    .info-item a {
      color: var(--color-primary-dark);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .contact-wrapper {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  submitForm(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.apiService.submitContact(this.formData).subscribe({
      next: (response: { message: string }) => {
        this.successMessage = response.message;
        this.resetForm();
      },
      error: (error: any) => {
        this.errorMessage = error.error?.message || 'Une erreur s\'est produite. Veuillez réessayer.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
