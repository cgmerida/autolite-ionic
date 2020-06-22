import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FirstGuard } from './guards/first.guard';
import { canActivate, redirectLoggedInTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';

const redirectLoggedInToInicio = () => redirectLoggedInTo(['app/inicio']);

const redirectOrVerifyEmail = () =>
  map((user: any) => {
    return user ? (user.emailVerified ? true : ['/verify-email']) : ['/login'];
  });

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule),
    canActivate: [FirstGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToInicio)
  },
  {
    path: 'login/forgot',
    loadChildren: () => import('./auth/forgot/forgot.module').then(m => m.ForgotPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./auth/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectOrVerifyEmail },
  },
  {
    path: 'admin/cars',
    loadChildren: () => import('./admin/cars/cars.module').then(m => m.CarsPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./admin/services/services.module').then(m => m.ServicesPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./admin/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
];


// {
//   path: '404',
//   loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundPageModule)
// },
// {
//   path: '**',
//   redirectTo: '/404',
//   pathMatch: 'full'
// },
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
