import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../models/User-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly #router = inject(Router);
  
  readonly currentUser = signal<UserModel | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.isAdmin ?? false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        this.logout();
      }
    }
  }

  login(user: UserModel): void {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async signIn(username: string, password: string, remember = false): Promise<boolean> {
    try {
      const res = await fetch('/db.json');
      if (!res.ok) return false;
      const data = await res.json();
      const users: UserModel[] = data.users ?? [];
      const user = users.find(u => u.username === username && u.password === password) as UserModel | undefined;
      if (!user) return false;
      this.login(user);
      if (remember) localStorage.setItem('rememberMe', 'true');
      else localStorage.removeItem('rememberMe');
      return true;
    } catch (error) {
      console.error('SignIn error', error);
      return false;
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    this.#router.navigateByUrl('/login');
  }

  checkAuth(): boolean {
    return this.isAuthenticated() && this.isAdmin();
  }
}
