import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/User-model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #error = inject(ErrorService);
  readonly #auth = inject(AuthService);

  readonly email = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly showPassword = signal(false);
  readonly loading = signal(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  login(form: NgForm): void {
    if (!form.valid) {
      this.#error.showWarning('Lütfen tüm alanları doldurun');
      return;
    }

    this.loading.set(true);

    this.#http.get<UserModel[]>('api/users').subscribe({
      next: (users) => {
        const user = users.find(u => 
          u.email === this.email() && 
          u.password === this.password()
        );

        if (user) {
          if (user.isAdmin) {
            this.#auth.login(user);
            if (this.rememberMe()) {
              localStorage.setItem('rememberMe', 'true');
            }
            this.#error.showSuccess('Giriş başarılı!');
            this.#router.navigateByUrl('/');
          } else {
            this.#error.showWarning('Bu hesap admin yetkisine sahip değil');
          }
        } else {
          this.#error.handleError(null, 'Email veya şifre hatalı');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.#error.handleError(err, 'Giriş yapılırken hata oluştu');
        this.loading.set(false);
      }
    });
  }
}
