import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'app',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'historial',
        loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('../pages/inicio/inicio.module').then(m => m.InicioPageModule)
      },

      {
        path: 'cars',
        loadChildren: () => import('../pages/cars/cars.module').then(m => m.CarsPageModule)
      },
      {
        path: '',
        redirectTo: '/app/inicio',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/app/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
