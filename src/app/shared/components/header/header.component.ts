import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="header__logo">
        <svg class="header__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="header__title">Ignis Solutions</span>
      </div>
      <nav class="header__nav">
        <span class="header__nav-item">Servicios</span>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header__logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header__icon {
      width: 32px;
      height: 32px;
      color: #2563eb;
    }

    .header__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e3a5f;
      letter-spacing: -0.025em;
    }

    .header__nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .header__nav-item {
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .header__nav-item:hover {
      color: #2563eb;
    }
  `]
})
export class HeaderComponent {}
