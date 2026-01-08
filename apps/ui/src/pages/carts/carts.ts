import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal, ViewEncapsulation } from '@angular/core';
import { Common } from '../../services/common';
import { cartModel } from '@e-ticaret/shared/models/cart.model';
import { TrCurrencyPipe } from 'tr-currency';
import { FlexiToastService } from 'flexi-toast';
import { RouterLink } from '@angular/router';
import { CategoryModel } from '@e-ticaret/shared/models/Category.model';


@Component({
    imports: [
        TrCurrencyPipe,
        RouterLink
    ],
    templateUrl: './carts.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Carts {
    readonly result = httpResource<cartModel[]>(() => {
        const endpoint = `api/carts?userId=${this.#common.user()!.id}`;
        return endpoint;
    });
    readonly data = computed(() => this.result.value() ?? []);
    readonly #toast = inject(FlexiToastService);

    // Pricing signals
    readonly taxRate = signal<number>(18);
    readonly shippingCost = signal<number>(0);

    readonly subtotal = computed(() => this.data().reduce((sum, item) => sum + (item.productPrice * (item.quantity ?? 1)), 0));
    readonly taxAmount = computed(() => Math.round(this.subtotal() * this.taxRate() / 100));
    readonly totalWithTax = computed(() => this.subtotal() + this.taxAmount() + this.shippingCost());

    readonly #http = inject(HttpClient);



    readonly #common = inject(Common);

    increment(val: cartModel) {
        val.quantity += 1;
        this.#http.put(`api/carts/${val.id}`, val).subscribe(() => {
            this.result.reload();
        });
    }

    decrement(val: cartModel) {
        const count = val.quantity - 1;
        if (count <= 0) {
            this.#toast.showSwal("Ürünü Sil","Bu ürünü sepetten silmek istediğinize emin misiniz?","Sil",() => {
                this.#http.delete(`api/carts/${val.id}`).subscribe(() => {
                    this.result.reload();
                });
            });
        } else {
            val.quantity--;
            this.#http.put(`api/carts/${val.id}`, val).subscribe(() => {
                this.result.reload();
            });
        }
    }
}
