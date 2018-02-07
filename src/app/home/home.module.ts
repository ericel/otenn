import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeRoutingModule } from 'app/home/home.routes.module';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from 'app/home/about/about.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from 'app/home/contact/contact.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    HomeRoutingModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent
  ]
})
export class HomeModule { }
