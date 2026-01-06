import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { CategoryModel } from '../../models/Category.model';
import { BreadcrumbModel } from '../../models/Breadcrumb.model';
import { ErrorService } from '../../services/error.service';


@Component({
  imports: [
    Blank,
    FlexiGridModule,
    RouterLink
  ],
  templateUrl: './categories.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Categories {
  readonly result = httpResource<CategoryModel[]>(() => 'api/categories');

  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  
  readonly breadcrumbs = computed<BreadcrumbModel[]>(() => [
    {title: 'Kategoriler', url: '/categories', icon: 'category'}
  ]);

  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);
  readonly #error = inject(ErrorService);

  delete(id: string){
    this.#toast.showSwal("Kategori sil?", "Kategoriyi silmek istiyor musunuz?","Sil",() => {
      this.#http.delete(`api/categories/${id}`).subscribe({
        next: () => {
          this.result.reload();
          this.#error.showSuccess('Kategori başarıyla silindi');
        },
        error: (err) => this.#error.handleError(err, 'Kategori silinirken hata oluştu')
      });
    })
  }
}