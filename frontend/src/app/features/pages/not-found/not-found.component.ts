import { Component } from '@angular/core';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [LayoutComponent, RouterLink],
  template: `
    <app-layout>
      <section class="not-found">
        <div class="container">
          <div class="not-found-content">
            <h1>404</h1>
            <h2>Page non trouvée</h2>
            <p>Désolé, la page que vous recherchez n'existe pas ou a été supprimée.</p>
            <a routerLink="/" class="btn btn-primary">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </section>
    </app-layout>
  `,
  styles: [`
    .not-found {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl) var(--spacing-md);
    }

    .not-found-content {
      text-align: center;
    }

    .not-found h1 {
      font-size: 5rem;
      color: var(--color-accent-gold);
      margin: 0;
      line-height: 1;
    }

    .not-found h2 {
      font-size: 2.5rem;
      color: var(--color-primary-dark);
      margin: var(--spacing-md) 0;
    }

    .not-found p {
      font-size: 1.1rem;
      color: var(--color-dark-gray);
      margin-bottom: var(--spacing-2xl);
    }
  `]
})
export class NotFoundComponent {}
