import { ChangeDetectionStrategy, Component, computed, inject, resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { CategoryModel, initialCategory } from '../../../models/Category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ErrorService } from '../../../services/error.service';

@Component({
  imports: [
    Blank,
    FormsModule
  ],
  templateUrl: './categories-create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateCategory {
  readonly id = signal<string | undefined>(undefined);
  readonly cardTitle = computed(() => this.id() ? 'Kategori Güncelle' : 'Kategori Ekle');
  readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');

  readonly result = resource({
    params: () => this.id(),
    loader: async() => {
      const res = await lastValueFrom(this.#http.get<CategoryModel>(`api/categories/${this.id()}`));

      return res;
    }
  })
  readonly data = computed(() => this.result.value() ?? {...initialCategory});

  readonly #http = inject(HttpClient);
  readonly #activated = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #error = inject(ErrorService);

  constructor(){
    this.#activated.params.subscribe((res) => {
      if(res['id']){
        this.id.set(res['id']);
      }
    });
  }

  save(form: NgForm){
    if(!form.valid) return;

    if(!this.id()){
      const newId = Date.now().toString();
      const categoryData = {
        ...this.data(),
        id: newId
      };
      
      this.#http.post(`api/categories`, categoryData).subscribe({
        next: () => {
          this.#error.showSuccess('Kategori başarıyla kaydedildi');
          this.#router.navigateByUrl("/categories");
        },
        error: (err) => this.#error.handleError(err, 'Kategori kaydedilirken hata oluştu')
      });
    } else {
      this.#http.put(`api/categories/${this.id()}`, this.data()).subscribe({
        next: () => {
          this.#error.showSuccess('Kategori başarıyla güncellendi');
          this.#router.navigateByUrl("/categories");
        },
        error: (err) => this.#error.handleError(err, 'Kategori güncellenirken hata oluştu')
      });
    }
  }
}