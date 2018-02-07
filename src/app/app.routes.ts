import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from 'app/home/home/home.component';
import { LoginComponent } from 'app/home/login/login.component';
import { NotFoundComponent } from '@shared/components/404/404.component';


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
{ path: 'notFound', component: NotFoundComponent},
{ path: '**', redirectTo: 'notFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
