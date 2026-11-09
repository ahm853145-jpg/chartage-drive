import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

interface FAQItem {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  template: `
    <app-layout>
      <section class="faq">
        <div class="container">
          <h1>Questions Fréquemment Posées</h1>
          <p class="faq-subtitle">Trouvez les réponses à vos questions les plus communes</p>

          <div class="faq-list">
            <div *ngFor="let item of faqItems" class="faq-item">
              <button class="faq-question" (click)="toggleFAQ($event)">
                <span>{{ item.question }}</span>
                <span class="faq-icon">{{ item.open ? '−' : '+' }}</span>
              </button>
              <div class="faq-answer" [class.open]="item.open">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </app-layout>
  `,
  styles: [`
    .faq {
      padding: var(--spacing-3xl) 0;
    }

    .faq h1 {
      text-align: center;
      margin-bottom: var(--spacing-md);
    }

    .faq-subtitle {
      text-align: center;
      font-size: 1.1rem;
      color: var(--color-dark-gray);
      margin-bottom: var(--spacing-2xl);
    }

    .faq-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .faq-item {
      border: 1px solid var(--color-gray);
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--transition-base);
    }

    .faq-item:hover {
      box-shadow: var(--shadow-md);
    }

    .faq-question {
      width: 100%;
      padding: var(--spacing-lg);
      background-color: var(--color-light-gray);
      border: none;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--color-primary-dark);
      transition: all var(--transition-base);
      font-size: 1rem;
      text-align: left;
    }

    .faq-question:hover {
      background-color: var(--color-accent-gold);
      color: var(--color-white);
    }

    .faq-icon {
      font-size: 1.5rem;
      font-weight: bold;
      transition: transform var(--transition-base);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      background-color: var(--color-white);
      transition: max-height var(--transition-base);
    }

    .faq-answer.open {
      max-height: 500px;
    }

    .faq-answer p {
      padding: var(--spacing-lg);
      margin: 0;
      color: var(--color-text-light);
      line-height: 1.8;
    }

    @media (max-width: 768px) {
      .faq {
        padding: var(--spacing-2xl) 0;
      }

      .faq h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class FaqComponent {
  faqItems: FAQItem[] = [
    {
      question: 'Quels sont les documents nécessaires pour louer une voiture?',
      answer: 'Vous aurez besoin d\'une pièce d\'identité valide, d\'un permis de conduire valide et d\'une carte bancaire. Pour les clients étrangers, un passeport est également requis.',
      open: false
    },
    {
      question: 'Quel est l\'âge minimum pour louer une voiture?',
      answer: 'L\'âge minimum est de 21 ans pour la plupart de nos véhicules. Certains véhicules premium requièrent un minimum de 25 ans.',
      open: false
    },
    {
      question: 'Votre tarif comprend-il l\'assurance?',
      answer: 'Oui, notre tarif inclut une assurance tiers obligatoire. Nous proposons également une assurance tous risques en option pour plus de protection.',
      open: false
    },
    {
      question: 'Puis-je annuler ma réservation?',
      answer: 'Oui, vous pouvez annuler jusqu\'à 24 heures avant le début de la location sans frais. Les annulations moins de 24 heures à l\'avance seront soumises à des frais.',
      open: false
    },
    {
      question: 'Proposez-vous la livraison de voiture?',
      answer: 'Oui, nous proposons la livraison à l\'aéroport ou à votre domicile moyennant des frais supplémentaires. Contactez-nous pour plus de détails.',
      open: false
    },
    {
      question: 'Que se passe-t-il en cas d\'accident?',
      answer: 'En cas d\'accident, contactez immédiatement notre équipe. Nous disposons d\'une couverture d\'assurance complète et notre équipe vous guidera à travers le processus de réclamation.',
      open: false
    }
  ];

  toggleFAQ(event: Event): void {
    const button = event.target as HTMLElement;
    const faqItem = button.closest('.faq-item');
    
    // Close all other items
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach((item) => {
      if (item !== faqItem) {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.classList.remove('open');
          // Find corresponding faqItem and toggle
          const index = Array.from(allItems).indexOf(item as Element);
          if (index !== -1) {
            this.faqItems[index].open = false;
          }
        }
      }
    });

    // Toggle current item
    const index = Array.from(allItems).indexOf(faqItem as Element);
    if (index !== -1) {
      this.faqItems[index].open = !this.faqItems[index].open;
    }
  }
}
