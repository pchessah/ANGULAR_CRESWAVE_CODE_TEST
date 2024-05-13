import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then((c) => c.LandingComponent)
  },
  {
    path: 'task/:id',
    loadComponent: () => import('./pages/tasks-details/tasks-details.component').then((c) => c.TasksDetailsComponent)
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }
];
