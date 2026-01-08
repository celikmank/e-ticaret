// import { OrderModel, initialOrder } from '@e-ticaret/shared/models/Order-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { OrderModel, initialOrder } from '@e-ticaret/shared/models/Order-model';
import { TrCurrencyPipe } from 'tr-currency';
import { cartModel } from '@e-ticaret/shared/models/cart.model';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [
    RouterLink,
    TrCurrencyPipe,
    FormsModule,
    DatePipe,
    NgxMaskDirective
  ],
  templateUrl: './payment.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Payment {
  readonly result = httpResource<cartModel[]>(() => `api/carts?userId=${this.#common.user()!.id}`);
  readonly carts = computed(() => this.result.value() ?? []);
  readonly total = computed(() => {
    let val = 0;
    this.carts().forEach(res => {
      val+= res.productPrice * res.quantity
    });

    return val;
  });
  readonly kdv = computed(() => this.total() * 18 / 100);
  readonly data = signal<OrderModel>({...initialOrder});
  readonly showSuccessPart = signal<boolean>(false);
  readonly term = signal<boolean>(false);

  readonly #common = inject(Common);
  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);

  pay(form: NgForm){
    if(!form.valid) return;

    this.data.update(prev => ({
      ...prev,
      userId: this.#common.user()!.id!,
      orderNumber: `TS-${new Date().getFullYear()}-${new Date().getTime()}`,
      date: new Date(),
      baskets: [...this.carts()]
    }));

    this.#http.post("api/orders", this.data()).subscribe(res => {
      this.showSuccessPart.set(true);
      this.carts().forEach(val => {
        this.#http.delete(`api/carts/${val.id}`).subscribe();
      })
      this.#common.cartCount.set(0);
    });
  }
}