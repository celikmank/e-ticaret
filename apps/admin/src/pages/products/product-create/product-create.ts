import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    linkedSignal,
    resource,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { FlexiSelectModule } from "flexi-select";
import { initialProduct, ProductModel } from '@e-ticaret/shared/models/Product.model';
import { CategoryModel } from '@e-ticaret/shared/models/Category.model';
import { BreadcrumbModel } from '@e-ticaret/shared/models/Breadcrumb.model';
import { ErrorService } from '../../../services/error.service';


@Component({
    standalone: true,
    imports: [Blank, FlexiGridModule, FormsModule, NgxMaskDirective, FlexiSelectModule],
    selector: 'app-product-create',
    templateUrl: './product-create.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export default class ProductCreate {
    readonly id = signal<string | undefined>(undefined);

    readonly result = resource({
        params: () => this.id(),
        loader: async () => {
            const res = await lastValueFrom(
                this.#http.get<ProductModel>(`api/products/${this.id()}`),
            );
            return res;
        },
    });

    readonly data = linkedSignal(() => this.result.value() ?? { ...initialProduct });
    readonly cardTitle = computed(() => this.id() ? 'Ürün Güncelle' : 'Ürün Ekle');
    readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');    
    readonly breadcrumbs = computed<BreadcrumbModel[]>(() => {
        const base: BreadcrumbModel[] = [
            {title: 'Ürünler', url: '/products', icon: 'deployed_code'}
        ];
        
        if (this.id()) {
            base.push({title: 'Güncelle', url: `/products/edit/${this.id()}`, icon: 'edit'});
        } else {
            base.push({title: 'Yeni Ürün Ekle', url: '/products/create', icon: 'add_circle'});
        }
        
        return base;
    });
    readonly categoryResult = httpResource<CategoryModel[]>(() => "api/categories");
    readonly categories = computed(() => this.categoryResult.value() ?? []);
    readonly categoryLoading = computed(() => this.categoryResult.isLoading());


    readonly #http = inject(HttpClient);
    readonly #router = inject(Router);
    readonly #activate = inject(ActivatedRoute);
    readonly #error = inject(ErrorService);

    constructor() {
        this.#activate.params.subscribe((res) => {
            if (res['id']) {
                this.id.set(res['id']);
            }
        });
    }

    onCategoryChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const categoryId = selectElement.value;
        const category = this.categories().find(c => c.id === categoryId);

        if (category) {
            this.data().categoryId = categoryId;
            this.data().categoryName = category.name;
        }
    }

    save(form: NgForm) {
        if (!form.valid) return;

        if (!this.id()) {
            // Yeni ürün için benzersiz ID oluştur
            const newId = Date.now().toString();
            const productData = {
                ...this.data(),
                id: newId
            };

            this.#http.post(`api/products`, productData).subscribe({
                next: () => {
                    this.#error.showSuccess('Ürün başarıyla eklendi');
                    this.#router.navigateByUrl("/products");
                },
                error: (err) => this.#error.handleError(err, 'Ürün eklenirken hata oluştu')
            });
        } else {
            this.#http.put(`api/products/${this.id()}`, this.data()).subscribe({
                next: () => {
                    this.#error.showSuccess('Ürün başarıyla güncellendi');
                    this.#router.navigateByUrl("/products");
                },
                error: (err) => this.#error.handleError(err, 'Ürün güncellenirken hata oluştu')
            });
        }
    }
    setCategoryName() {
        const id = this.data().categoryId;
        const category = this.categories().find(c => c.id === id);
        this.data.update((prev) => ({ ...prev, categoryName: category?.name ?? "", categoryUrl: category?.url ?? "" }));
    }


}
