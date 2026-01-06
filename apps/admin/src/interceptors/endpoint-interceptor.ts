import { HttpInterceptorFn } from '@angular/common/http';

export const endpointInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('api/')) return next(req);
  
  const newUrl = req.url.replace('api/', 'http://localhost:3000/');
  const clone = req.clone({ url: newUrl });
  return next(clone);
};