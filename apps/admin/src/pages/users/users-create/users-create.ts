import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FlexiToastService } from 'flexi-toast';
import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { initialUser, UserModel } from '../../../models/User-model';
import { BreadcrumbModel } from '../../../models/Breadcrumb.model';
import { ErrorService } from '../../../services/error.service';


@Component({
  imports: [
    Blank,
    FormsModule
  ],
  templateUrl: './users-create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateUser {
  readonly #http = inject(HttpClient);
  readonly #activated = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);
  readonly #error = inject(ErrorService);

  readonly id = toSignal(this.#activated.paramMap.pipe(
    map(params => params.get('id') ?? undefined)
  ));

  readonly result = resource({
    params: () => this.id(),
    loader: async ({ params: id }) => {
      if (!id) return undefined;
      return await lastValueFrom(this.#http.get<UserModel>(`api/users/${id}`));
    }
  });

  readonly data = linkedSignal(() => this.result.value() ?? {...initialUser});
  readonly title = computed(() => this.id() ? 'Kullanıcı Güncelle' : 'Kullanıcı Ekle');
  readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');
  
  readonly breadcrumbs = computed<BreadcrumbModel[]>(() => {
    const base: BreadcrumbModel[] = [
      {title: 'Kullanıcılar', url: '/users', icon: 'group'}
    ];
    
    if (this.id()) {
      base.push({title: 'Güncelle', url: `/users/edit/${this.id()}`, icon: 'edit'});
    } else {
      base.push({title: 'Ekle', url: '/users/create', icon: 'add'});
    }
    
    return base;
  });

  save(form:NgForm){
    if(!form.valid) return;

    this.data.update((prev) => 
        ({...prev, fullName: `${prev.firstName} ${prev.lastName}`}));

    if(!this.id()){
      const newUser = {
        ...this.data(),
        id: Date.now().toString()
      };
      this.#http.post("api/users", newUser).subscribe({
        next: () => {
          this.#error.showSuccess('Kullanıcı başarıyla kaydedildi');
          this.#router.navigateByUrl("/users");
        },
        error: (err) => this.#error.handleError(err, 'Kullanıcı kaydedilirken hata oluştu')
      });
    }else{
      this.#http.put(`api/users/${this.id()}`, this.data()).subscribe({
        next: () => {
          this.#error.showSuccess('Kullanıcı başarıyla güncellendi');
          this.#router.navigateByUrl("/users");
        },
        error: (err) => this.#error.handleError(err, 'Kullanıcı güncellenirken hata oluştu')
      });
    }
  }
}