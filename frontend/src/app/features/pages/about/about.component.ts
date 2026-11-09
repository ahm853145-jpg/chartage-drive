import { Component } from '@angular/core';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout>
      <section class="about">
        <div class="container">
          <h1>À propos de Carthage Drive</h1>
          <div class="about-content">
            <p>
              Carthage Drive est une agence tunisienne spécialisée dans la location de voitures,
              offrant des véhicules fiables, un service professionnel et des tarifs transparents.
            </p>
            <h2>Notre Mission</h2>
            <p>
              Notre mission est de fournir une expérience de location de voitures exceptionnelle
              à nos clients, en mettant l'accent sur la qualité, la sécurité et la satisfaction.
            </p>
            <h2>Nos Valeurs</h2>
            <ul>
              <li>Honnêteté et transparence</li>
              <li>Qualité et fiabilité</li>
              <li>Service client excellent</li>
              <li>Tarifs justes et compétitifs</li>
              <li>Respecte de l'environnement</li>
            </ul>
          </div>
        </div>
      </section>
    </app-layout>
  `,
  styles: [`
    .about {
      padding: var(--spacing-3xl) 0;
    }

    .about h1 {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .about-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .about-content p {
      line-height: 1.8;
      margin-bottom: var(--spacing-lg);
    }

    .about-content h2 {
      color: var(--color-primary-dark);
      margin-top: var(--spacing-2xl);
    }

    .about-content ul {
      list-style: none;
      padding-left: var(--spacing-lg);
    }

    .about-content li {
      margin-bottom: var(--spacing-md);
      padding-left: var(--spacing-lg);
      position: relative;
    }

    .about-content li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-success);
      font-weight: bold;
    }
  `]
})
export class AboutComponent {}
