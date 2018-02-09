import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkinModule } from '@shared/skin/skin.module';
import * as moment from 'moment';
import { App_Pipes } from '@shared/pipes';
import { SHARED_COMPONENTS, SHARED_ENTRY_COMPONENTS } from '@shared/components';
import { RouterModule } from '@angular/router';
import { SHARED_SERVICES } from '@shared/services';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgPipesModule} from 'ngx-pipes';
import { DialogImg } from '@shared/components/wysiwyg/wysiwyg.component';
import { FormsModule } from '@angular/forms';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import { NgMasonryGridModule } from 'ng-masonry-grid';
import * as firebase from 'firebase';
import { environment } from '@environments/environment';
firebase.initializeApp(environment.firebase);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkinModule,
    NgbModule,
    NgPipesModule,
    FormsModule,
    NgxPageScrollModule,
    NgMasonryGridModule
  ],
  exports: [
    RouterModule,
    SkinModule,
    NgbModule,
    NgPipesModule,
    ...App_Pipes,
    NgxPageScrollModule,
    NgMasonryGridModule,
    ...SHARED_COMPONENTS
  ],
  declarations: [
    ...App_Pipes,
   ...SHARED_COMPONENTS
  ],
  providers: [
  ],
  entryComponents: [
    SHARED_ENTRY_COMPONENTS
  ]
})
export class SharedModule { }
