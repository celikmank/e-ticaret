import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CategoryModel } from '@e-ticaret/shared/models/Category.model';

@Component({
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Layouts {
  readonly result = httpResource<CategoryModel[]>(() => "api/categories");
  readonly data = computed(() => this.result.value() ?? []);

  readonly #router = inject(Router);

  logout() {
    localStorage.clear();
    this.#router.navigateByUrl("/auth/login");
  }
}