import { Component, OnInit } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { Page } from '@collections/state/page.model';
import { ActivatedRoute,Data } from '@angular/router';
import { SessionService } from '@shared/services/session.service';
import { Collection } from '@collections/state/collections.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}))
        ]
      )]
    )
  ]
})
export class PageComponent implements OnInit {
  photo = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  collections;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    private _session: SessionService
  ) { }

  ngOnInit() {
    this.collections = this._collections.collections;
  }

}

@Component({
  selector: 'app-pages',
  template: `
  <div class="gutter-2 row " [@myAnimation] *ngIf="pages">
    <div class="col-lg-4 pages" *ngFor="let page of pages">
      <button class="menu-button" mat-icon-button [matMenuTriggerFor]="pageMenu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #pageMenu="matMenu" xPosition="before">
      <a mat-menu-item>Report</a>
      <a mat-menu-item routerLink="/collections/editpage/{{page.title | slugify}}"
      [queryParams]="{ key: page.$key}" [fragment]="page.collectionKey">Edit Collection</a>
    </mat-menu>
    <a routerLink="/collections/{{page.collection | slugify }}/pages/{{page.title | slugify }}"
    [fragment]="page.collectionKey" mat-raised-button class="checkit"> Check it</a>
         <mat-card class="collection-card mar-20">
             <img mat-card-image mat-elevation-z2 [src]="page.photoURL" [alt]="page.title">
             <div class="collection-img">
                 <img [src]="page.photoURL" class="img-thumbnail" [alt]="">
             </div>
             <mat-card-title><a routerLink="/collections/{{page.collection | slugify }}/pages/{{page.title | slugify }}"
             [fragment]="page.collectionKey">{{page.title | shorten: 100:'..'}}</a></mat-card-title>
             <mat-card-subtitle>
                 {{page.uid}}
             </mat-card-subtitle>
             <mat-card-content>
               <p>
                   {{page.description | shorten: 150:'..'}}
               </p>
             </mat-card-content>
           </mat-card>
     </div>
</div>

  `,
  styleUrls: ['./page.component.css'],
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}))
        ]
      )]
    )
  ]
})
export class PagesComponent implements OnInit {

  collections;
  pages;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    private _session: SessionService
  ) { }

  ngOnInit() {
    this.collections = this._collections.collections;
   this._route.fragment
    .subscribe(
      (fragment: string) => {
        this._collections.getCollection(fragment).subscribe((collection: Collection) => {
          this._collections.getCollectionPages(fragment, collection.title).subscribe(
            (pages) => {
               this.pages = pages;
            });
        });
      });
  }

}
