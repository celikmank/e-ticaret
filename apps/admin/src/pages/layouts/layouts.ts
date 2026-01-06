import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Breadcrump } from './breadcrumb/breadcrump';
import { navigations } from '../../models/Navigation.model';
import { NavPipe } from '../../pipes/nav-pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [
    Breadcrump,
    RouterLink,
    RouterLinkActive,
    NavPipe,
    FormsModule,
    DatePipe,
    RouterOutlet,
],
  templateUrl: './layouts.html',
  styleUrls: ['./layouts.css'],
})
export class layouts {
  readonly #auth = inject(AuthService);
  readonly currentUser = this.#auth.currentUser;
  
  readonly navigations = computed(() => navigations);
  readonly time = signal<Date | string>('');
  readonly search = signal<string>('');

  constructor() {
    setInterval(() => {
      this.time.set(new Date());
    }, 1000);
  }
  
  logout(): void {
    this.#auth.logout();
  }
} 