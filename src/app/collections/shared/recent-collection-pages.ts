import { Component, OnInit, Input } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Subscription } from 'rxjs/Subscription';
import { Collection } from '@collections/state/models/collection.model';

import { Page } from '@collections/state/models/page.model';
import { Store, select } from '@ngrx/store';
import * as pageActions from '@collections/state/actions/page.actions';
import * as fromPage from '@collections/state';
import { Observable } from 'rxjs/Observable';
@Component ({
  selector: 'recent-pages-card',
  template:`
    <ng-container *ngFor="let page of pages; let i=index">
    <div *ngIf="i < limit">
    <mat-card class="mar-30 recent-card" >
    <a routerLink="/collections/c/{{collection.title | slugify}}/pages/{{page.title | slugify}}/{{page.id}}"
     [fragment]="page.collectionKey">
    <img mat-card-image [src]="page.photoURL" [alt]="page.title">
      <h3 [innerHTML]="page.title"></h3>
    </a>
    </mat-card>
    </div>
    </ng-container>
  `,
  styleUrls: ['./shared.css']
})
export class RecentPages implements OnInit {
  @Input() collectionKey: string;
  @Input() limit: number;
  pages;
  sub: Subscription;
  collection: Collection;
  constructor(
    private store: Store<fromPage.State>
  ){}

  ngOnInit () {
     const collections = this.store.select(fromPage.getAllPages);
        this.store.dispatch(  new pageActions.Query() );
         collections.subscribe(data => {
          this.pages =  data.filter((item) => {
             return item.collectionKey === this.collectionKey;
       });
   });
  }
}
