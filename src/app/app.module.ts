import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from 'app/app.routes';
import { HomeModule } from 'app/home/home.module';
import { SharedModule } from '@shared/shared.module';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SHARED_SERVICES } from '@shared/services';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '@environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'Otenn' }),
    BrowserAnimationsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase, 'Otenn'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,

  ],
  providers: [...SHARED_SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
