import { Injectable, inject } from '@angular/core';
import { FlexiToastService } from 'flexi-toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  readonly #toast = inject(FlexiToastService);

  handleError(error: any, customMessage?: string): void {
    console.error('Error occurred:', error);

    let errorMessage = customMessage || 'Bir hata oluştu';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Hata: ${error.error.message}`;
    } else if (error.status) {
      // HTTP error
      switch (error.status) {
        case 400:
          errorMessage = customMessage || 'Geçersiz istek';
          break;
        case 401:
          errorMessage = customMessage || 'Yetkilendirme hatası';
          break;
        case 403:
          errorMessage = customMessage || 'Erişim reddedildi';
          break;
        case 404:
          errorMessage = customMessage || 'Kayıt bulunamadı';
          break;
        case 500:
          errorMessage = customMessage || 'Sunucu hatası';
          break;
        default:
          errorMessage = customMessage || `Hata kodu: ${error.status}`;
      }
    }

    this.#toast.showToast('Hata', errorMessage, 'error');
  }

  showSuccess(message: string): void {
    this.#toast.showToast('Başarılı', message, 'success');
  }

  showWarning(message: string): void {
    this.#toast.showToast('Uyarı', message, 'warning');
  }

  showInfo(message: string): void {
    this.#toast.showToast('Bilgi', message, 'info');
  }
}
