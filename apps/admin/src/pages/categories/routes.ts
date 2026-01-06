import { Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./categories')
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./categories-create/categories-create')
    },
    {
        path: 'edit/:id',
        loadComponent: () =>
            import('./categories-create/categories-create')
    }
    
]
 export default routes;
