import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
    {
        path: 'login',
        loadComponent: () =>
            import('./pages/login/login').then((m) => m.Login),
    },
    {
        path: "",
        loadComponent: () =>
            import('./pages/layouts/layouts').then(m => m.layouts),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/home/home').then((m) => m.Home),
            },
            {
                path: 'products',
                loadChildren: () =>
                    import('./pages/products/routes')
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('./pages/categories/routes')
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./pages/users/routes')
            }
        ],
    },
];
