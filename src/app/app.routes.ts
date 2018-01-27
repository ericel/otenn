import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from 'app/home/home/home.component';
import { LoginComponent } from 'app/home/login/login.component';

export const routes: Routes = [
  {
   path: '',
   component: HomeComponent,
   pathMatch: 'full'
 },
 {
   path: 'login',
   component: LoginComponent
 },
 { path: 'collections', loadChildren: './collections/collections.module#CollectionsModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, /*{preloadingStrategy: PreloadAllModules}*/)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
