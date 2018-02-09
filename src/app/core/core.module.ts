import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent, SignupDialog } from 'app/core/header/header.component';
import { FooterComponent } from 'app/core/footer/footer.component';
import { NotifyComponent } from 'app/core/notify/notify.component';
import { NotFoundComponent } from 'app/core/404/404.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotifyComponent,
    NotFoundComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NotifyComponent,
    NotFoundComponent
  ]
})
export class CoreModule { }
