import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <!-- Logo & Description -->
          <div class="footer-section">
            <h3 class="footer-title">CARTHAGE DRIVE</h3>
            <p class="footer-slogan">Votre route commence ici.</p>
            <p class="footer-description">
              Une agence tunisienne spécialisée dans la location de voitures,
              offrant des véhicules fiables, un service professionnel et des tarifs transparents.
            </p>
            <div class="social-links">
              <a href="https://facebook.com" target="_blank" class="social-icon" title="Facebook">
                <i>f</i>
              </a>
              <a href="https://instagram.com" target="_blank" class="social-icon" title="Instagram">
                <i>📷</i>
              </a>
              <a href="https://tiktok.com" target="_blank" class="social-icon" title="TikTok">
                <i>♪</i>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div class="footer-section">
            <h4 class="footer-subtitle">Navigation</h4>
            <ul class="footer-links">
              <li><a routerLink="/home">Accueil</a></li>
              <li><a routerLink="/cars">Nos voitures</a></li>
              <li><a routerLink="/about">À propos</a></li>
              <li><a routerLink="/contact">Contact</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
            </ul>
          </div>

          <!-- Company Info -->
          <div class="footer-section">
            <h4 class="footer-subtitle">Informations</h4>
            <div class="footer-info">
              <p><strong>Téléphone:</strong><br/><a href="tel:+216 95 123 456">+216 95 123 456</a></p>
              <p><strong>Email:</strong><br/><a href="mailto:contact@carthagedrive.tn">contact@carthagedrive.tn</a></p>
              <p><strong>Adresse:</strong><br/>Tunis, Tunisie</p>
            </div>
          </div>

          <!-- Legal -->
          <div class="footer-section">
            <h4 class="footer-subtitle">Légal</h4>
            <ul class="footer-links">
              <li><a href="#">Conditions Générales</a></li>
              <li><a href="#">Politique de Confidentialité</a></li>
              <li><a href="#">Politique de Cookies</a></li>
              <li><a href="#">Mentions Légales</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            <p>&copy; 2026 Carthage Drive. Tous droits réservés.</p>
          </div>
          <div class="footer-credits">
            <p>Développé avec ❤️ pour les amoureux de route en Tunisie</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--color-primary-dark);
      color: var(--color-white);
      padding: var(--spacing-3xl) 0 var(--spacing-lg);
      margin-top: var(--spacing-3xl);
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-2xl);
      margin-bottom: var(--spacing-2xl);
      padding-bottom: var(--spacing-2xl);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .footer-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-accent-gold);
      margin: 0;
    }

    .footer-subtitle {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-white);
      margin: 0;
    }

    .footer-slogan {
      font-style: italic;
      color: var(--color-accent-gold);
      font-weight: 500;
      margin: 0;
    }

    .footer-description {
      font-size: 0.95rem;
      line-height: 1.6;
      opacity: 0.9;
      margin: 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: var(--spacing-sm);
    }

    .footer-links a {
      color: var(--color-white);
      text-decoration: none;
      opacity: 0.8;
      transition: all var(--transition-base);
    }

    .footer-links a:hover {
      color: var(--color-accent-gold);
      opacity: 1;
    }

    .footer-info {
      font-size: 0.95rem;
      line-height: 1.8;
    }

    .footer-info p {
      margin: var(--spacing-sm) 0;
    }

    .footer-info a {
      color: var(--color-accent-gold);
      text-decoration: none;
      transition: color var(--transition-base);
    }

    .footer-info a:hover {
      color: var(--color-white);
    }

    .social-links {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
    }

    .social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: var(--color-white);
      text-decoration: none;
      transition: all var(--transition-base);
      border: 2px solid transparent;
    }

    .social-icon:hover {
      background-color: var(--color-accent-gold);
      color: var(--color-primary-dark);
      transform: translateY(-3px);
    }

    .footer-bottom {
      text-align: center;
      padding-top: var(--spacing-lg);
    }

    .footer-copyright,
    .footer-credits {
      font-size: 0.9rem;
      opacity: 0.8;
      margin: 0;
    }

    .footer-credits {
      margin-top: var(--spacing-sm);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        padding-bottom: var(--spacing-lg);
      }

      .footer {
        padding: var(--spacing-2xl) 0 var(--spacing-lg);
      }
    }
  `]
})
export class FooterComponent {}
