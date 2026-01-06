import { ChangeDetectionStrategy, Component, computed, inject,ViewEncapsulation } from "@angular/core";
import Blank from "../../components/blank";
import { FlexiGridFilterDataModel, FlexiGridModule } from "flexi-grid";
import { ProductModel } from "../../models/Product.model";
import { HttpClient, httpResource } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { FlexiToastService } from "flexi-toast";
import { CategoryModel } from "../../models/Category.model";
import { BreadcrumbModel } from "../../models/Breadcrumb.model";
import { ErrorService } from "../../services/error.service";




@Component({
    selector: 'app-products',

    imports: [Blank, FlexiGridModule, RouterLink],
    templateUrl: './products.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export default class Products {
    readonly result = httpResource<ProductModel[]>(() => 'api/products');
    readonly data = computed(() => this.result.value() ?? []);
    readonly loading = computed(() => this.result.isLoading());
    
    readonly breadcrumbs = computed<BreadcrumbModel[]>(() => [
        {title: 'Ürünler', url: '/products', icon: 'deployed_code'}
    ]);

    readonly categoryResult = httpResource<CategoryModel[]>(() => 'api/categories');
    readonly categoryFilter = computed(() => {
    const categories = this.categoryResult.value() ?? [];
    return categories.map<FlexiGridFilterDataModel>(c => ({
        name: c.name,
        value: c.name
    }));
});

    readonly #toast = inject(FlexiToastService);
    readonly #http = inject(HttpClient);
    readonly #error = inject(ErrorService);

    delete(id: string) {
        this.#toast.showSwal('Ürünü Sil? ', 'Ürünü Silmek İstiyor Musunuz?', 'Sil', () => {
            this.#http.delete(`api/products/${id}`).subscribe({
                next: () => {
                    this.result.reload();
                    this.#error.showSuccess('Ürün başarıyla silindi');
                },
                error: (err) => this.#error.handleError(err, 'Ürün silinirken hata oluştu')
            });   
        });
    }
}