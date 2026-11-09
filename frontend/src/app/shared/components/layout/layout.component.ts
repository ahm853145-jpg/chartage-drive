import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  template: `
    <div class="layout-wrapper">
      <app-navbar></app-navbar>
      <main class="layout-main">
        <ng-content></ng-content>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class LayoutComponent {}
