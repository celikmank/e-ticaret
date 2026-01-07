import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { CategoryModel } from '@e-ticaret/shared/models/Category.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './navbar.html'
})
export class Navbar {
  readonly result = httpResource<CategoryModel[]>(() => `api/categories`);
  readonly data = computed(() => this.result.value() ?? []);
}