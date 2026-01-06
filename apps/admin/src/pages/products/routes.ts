import { Routes } from "@angular/router";

 const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./products').then((m) => m.default)
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./product-create/product-create').then((m) => m.default)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./product-create/product-create').then((m) => m.default)
    }
]

export default routes;