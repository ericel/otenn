import { Component, OnInit, Input } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Subscription } from 'rxjs/Subscription';
import { Collection } from '@collections/state/collections.model';
import { Observable } from '@firebase/util';

@Component ({
  selector: 'recent-pages-card',
  template:`
    <ng-container *ngFor="let page of pages; let i=index">
    <div *ngIf="i < limit">
    <mat-card class="mar-30 recent-card" >
    <a routerLink="/collections/c/{{collection.title | slugify}}/pages/{{page.title | slugify}}/{{page.$key}}"
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
    private _collections: CollectionsService
  ){}

  ngOnInit () {
   this.sub = this._collections.getCollection(this.collectionKey)
   .subscribe((collection: Collection) => {
      this.collection = collection;
      this._collections.getCollectionPages(collection.$key, collection.title).subscribe((pages) => {
        this.pages = pages;
      });
   });
  }
}
