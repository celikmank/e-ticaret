import { httpResource } from '@angular/common/http';
import { Component, computed, signal, effect } from '@angular/core';
import { ProductModel } from '@e-ticaret/shared/models/Product.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TrCurrencyPipe } from 'tr-currency';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TrCurrencyPipe, InfiniteScrollDirective],
  templateUrl: './products.html'
})
export class Products {
  readonly start = signal<number>(0);
  readonly limit = 6; // Her seferinde kaç ürün gelsin?

  // API isteği: start() her değiştiğinde otomatik tetiklenir
  readonly result = httpResource<ProductModel[]>(() => 
    `api/products?_limit=${this.limit}&_start=${this.start()}`
  );

  // Ekranda gösterilecek birikmiş liste
  readonly dataSignal = signal<ProductModel[]>([]);

  constructor() {
    // API'den yeni veri geldikçe mevcut listeye ekle
    effect(() => {
      const newData = this.result.value();
      if (newData && newData.length > 0) {
        this.dataSignal.update(prev => [...prev, ...newData]);
      }
    });
  }

  onScroll() {
    // Eğer şu an bir yükleme varsa veya hata oluştuysa yeni istek atma
    if (this.result.isLoading()) return;

    // Start değerini artırarak bir sonraki paketi tetikle
    this.start.update(value => value + this.limit);
  }
}