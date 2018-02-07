import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent, CollectionsStartComponent } from '@collections/index/index.component';
import { StartComponent } from '@collections/start/start.component';
import { CollectionComponent } from '@collections/collection/collection.component';
import { AddcollectionComponent } from '@collections/start/addcollection/addcollection.component';
import { CanDeactivateGuard } from '@collections/start/can-deactivate-guard.service';
import { AddpageComponent } from '@collections/start/addpage/addpage.component';
import { EditcollectionComponent } from '@collections/start/addcollection/editcollection/editcollection.component';
import { PageComponent, PagesComponent } from '@collections/collection/pages/page.component';
import { EditpageComponent } from '@collections/start/addpage/editpage/editpage.component';
import { ForumsComponent } from '@collections/collection/forums/forums.component';
import { ForumComponent } from '@collections/collection/forums/forum/forum.component';
import { NotFoundComponent } from '@shared/components/404/404.component';


const collectionsRoutes: Routes = [
    {
      path: 'c',
      component: CollectionsStartComponent,
      children: [
          { path: '', component: IndexComponent},
          { path: ':string', component: CollectionComponent,
          children: [
             {path: 'pages', component:  PagesComponent},
             {path: 'pages/:string/:key', component: PageComponent},
             {path: 'forums', component: ForumsComponent},
             {path: 'forums/:string/:key', component: ForumComponent},
             {path: 'videos', component: PagesComponent},
             {path: 'photos', component: PagesComponent}
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
    path: 'editpage/:string', component: EditpageComponent, canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'addpage', component: AddpageComponent, canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(collectionsRoutes)
  ],
  exports: [RouterModule]
})
export class CollectionsRoutingModule {}
