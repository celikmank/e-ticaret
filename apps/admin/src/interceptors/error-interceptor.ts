import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        // Sadece 500+ server hataları için retry yap
        if (error instanceof HttpErrorResponse && error.status >= 500) {
          return timer(1000 * retryCount); // 1s, 2s delay
        }
        // Diğer hatalar için retry yapma
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Konsola detaylı log
      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: error.message,
        error: error.error
      });

      // Kullanıcıya hata mesajı göster
      let customMessage: string | undefined;
      
      if (error.status === 0) {
        customMessage = 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
      } else if (error.status === 404 && req.method === 'GET') {
        customMessage = 'İstenen veri bulunamadı';
      } else if (error.status >= 500) {
        customMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      }

      errorService.handleError(error, customMessage);

      return throwError(() => error);
    })
  );
};
