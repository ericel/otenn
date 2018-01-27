import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollectionsRoutingModule } from '@collections/collections.routes';

import { IndexComponent, CollectionsStartComponent } from '@collections/index/index.component';
import { StartComponent } from './start/start.component';
import { COLLECTION_COMPONENTS } from './collection/collection.component';
import { CollectionsService } from '@collections/state/collections.service';
import { AddcollectionComponent} from '@collections/start/addcollection/addcollection.component';
import { CanDeactivateGuard } from '@collections/start/can-deactivate-guard.service';
import { AddpageComponent } from '@collections/start/addpage/addpage.component';
import { NotifyService } from '@shared/services/notify.service';
import { EditcollectionComponent } from '@collections/start/addcollection/editcollection/editcollection.component';
import { CollectioncomponentComponent } from '@collections/collection/collectioncomponent/collectioncomponent.component';
import { PageComponent } from './collection/page/page.component';
import { NgMasonryGridModule } from 'ng-masonry-grid';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CollectionsRoutingModule,
    NgMasonryGridModule
  ],
  declarations: [
    IndexComponent,
    CollectionsStartComponent,
    StartComponent,
    AddcollectionComponent,
    AddpageComponent,
    EditcollectionComponent,
    CollectioncomponentComponent,
    PageComponent,
    COLLECTION_COMPONENTS
  ],
  providers: [ CollectionsService, CanDeactivateGuard, ]

})
export class CollectionsModule { }

