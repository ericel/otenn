import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from 'app/home/about/about.component';
import { ContactComponent } from 'app/home/contact/contact.component';


const homeRoutes: Routes = [
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent}
];

@NgModule ({
  imports: [
     RouterModule.forChild(homeRoutes)
  ],
  exports: [
     RouterModule
  ]
})

export class HomeRoutingModule {}
