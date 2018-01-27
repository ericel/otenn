import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent, CollectionsStartComponent } from '@collections/index/index.component';
import { StartComponent } from '@collections/start/start.component';
import { CollectionComponent } from '@collections/collection/collection.component';
import { AddcollectionComponent } from '@collections/start/addcollection/addcollection.component';
import { CanDeactivateGuard } from '@collections/start/can-deactivate-guard.service';
import { AddpageComponent } from '@collections/start/addpage/addpage.component';
import { EditcollectionComponent } from '@collections/start/addcollection/editcollection/editcollection.component';
import { CollectioncomponentComponent } from '@collections/collection/collectioncomponent/collectioncomponent.component';
import { PageComponent } from '@collections/collection/page/page.component';

const collectionsRoutes: Routes = [
    {
      path: 'c',
      component: CollectionsStartComponent,
      children: [
          { path: '', component: IndexComponent},
          { path: ':string', component: CollectionComponent,
          children: [
             {path: ':string', component: CollectioncomponentComponent}
          ]}
      ]
  },
  {
      path: 'start', component: StartComponent
  },
  {
    path: 'addcollection', component: AddcollectionComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'editcollection/:string', component: EditcollectionComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'addpage', component: AddpageComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: ':string/:string', component: PageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(collectionsRoutes)
  ],
  exports: [RouterModule]
})
export class CollectionsRoutingModule {}