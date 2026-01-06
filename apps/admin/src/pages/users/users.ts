import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { UserModel } from '../../models/User-model';
import { BreadcrumbModel } from '../../models/Breadcrumb.model';
import { FormsModule } from "@angular/forms";
import { ErrorService } from '../../services/error.service';

@Component({
  imports: [
    Blank,
    FlexiGridModule,
    RouterLink,
    FormsModule
],
  templateUrl: './users.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Users {
  readonly result = httpResource<UserModel[]>(() => "api/users");
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  
  readonly breadcrumbs = computed<BreadcrumbModel[]>(() => [
    {title: 'Kullanıcılar', url: '/users', icon:'group'}
  ]);

  readonly #toast = inject(FlexiToastService);
  readonly #http = inject(HttpClient);
  readonly #error = inject(ErrorService);

  delete(id: string){
    this.#toast.showSwal("Kullanıcıyı Sil?","Kullanıcı silmek istiyor musunuz?","Sil",() => {
      this.#http.delete(`api/users/${id}`).subscribe({
        next: () => {
          this.result.reload();
          this.#error.showSuccess('Kullanıcı başarıyla silindi');
        },
        error: (err) => this.#error.handleError(err, 'Kullanıcı silinirken hata oluştu')
      });
    })
  }
  changeIsAdmin(data: UserModel){
    this.#http.put(`api/users/${data.id}`, data).subscribe(() => {
        this.result.reload();
    });
  }
}