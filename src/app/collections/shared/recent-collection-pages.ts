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
    <mat-card class="mar-20 recent-card" >
    <img mat-card-image src="https://material.angular.io/assets/img/examples/shiba2.jpg" alt="Photo of a Shiba Inu">
    <mat-card-content>
      <h3 [innerHTML]="page.title"></h3>
    </mat-card-content>
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
  constructor(
    private _collections: CollectionsService
  ){}

  ngOnInit () {
  console.log(this.collectionKey)
   this.sub = this._collections.getCollection(this.collectionKey)
   .subscribe((collection: Collection) => {
     console.log(collection)
      this._collections.getCollectionPages(collection.$key, collection.title).subscribe((pages) => {
        this.pages = pages;
      });
   });
  }
}
