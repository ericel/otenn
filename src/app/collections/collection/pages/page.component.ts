import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import {trigger, transition, style, animate, state} from '@angular/animations';

import { ActivatedRoute, Params } from '@angular/router';
import { SessionService } from '@shared/services/session.service';
import { Collection } from '@collections/state/models/collection.model';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { UcFirstPipe } from 'ngx-pipes';

import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { NgMasonryGridService } from 'ng-masonry-grid';

import { Page } from '@collections/state/models/page.model';
import { Store, select } from '@ngrx/store';
import * as pageActions from '@collections/state/actions/page.actions';
import * as fromPage from '@collections/state/reducers/page.reducer';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
  providers: [UcFirstPipe],
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
export class PageComponent implements OnInit, OnDestroy {
  collections;
  page: Observable<any>;
  pages: Observable<any>;
  sub: Subscription;
  collectionKey: string;
  collectionTitle: string;
  loading$: Observable<boolean>;
  @ViewChild('pageRef') pageRef: ElementRef;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    private _session: SessionService,
    private _title: Title,
    private _meta: Meta,
    private _ucFirst: UcFirstPipe,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private store: Store<fromPage.State>
  ) {
    this.loading$ = this.store.pipe(select(fromPage.getLoading));
   }

  ngOnInit() {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
    this.sub = this._route.fragment.subscribe(
      (collectionkey: string) => {
      this.collectionKey = collectionkey;
       this.collections = this.store.select(fromPage.selectAll);
        this.store.dispatch(  new pageActions.Query() );
        this.collections.subscribe(data => {
          this.pages =  data.filter((item) => {
             return item.collectionKey === collectionkey;
           });
          this._route.params.subscribe((section: Params) => {
            const pageData =  data.filter((item) => {
              return item.id === section['key'];
            });
            this.page = pageData[0];
           const page = pageData[0];
            if (page) {
                this.collectionTitle = page.title;
            }
          this._title.setTitle(this._ucFirst.transform(this.collectionTitle));
          this._meta.addTags([
            { name: 'keywords',
            content: this._ucFirst.transform(this.collectionTitle)  + this._ucFirst.transform(this.collectionTitle) + 'Blogs'},
            { name: 'description',
             content: this._ucFirst.transform(this.collectionTitle) + ' Pages and blogs contributed by collection subscribers.' }
          ]);
        });
         });
      });
  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }

  onDelete(id) {
    this.store.dispatch(  new pageActions.Delete(id));
    //TODO: DELETE COMMENTS OF PAGE TOO BY SERVICE
  }
}

@Component({
  selector: 'app-pages',
  providers: [UcFirstPipe],
  template: `
  <div  #pageRef></div>
  <loading [load]="(loading$ | async)"></loading>

  <div  [@myAnimation] *ngIf="pages && (pages.length > 0) && (loading$ | async)" class="row">
   <div *ngFor="let page of pages" class="col-md-4 mar-20">
  <ng-container *ngIf="page.status !== 'Draft'">
  <button class="menu-button" mat-icon-button [matMenuTriggerFor]="pageMenu">
  <mat-icon>more_vert</mat-icon>
  </button>
  <mat-menu #pageMenu="matMenu" xPosition="before">
  <a mat-menu-item>Report</a>
  <a mat-menu-item routerLink="/collections/editpage/{{page.title | slugify}}"
  [queryParams]="{ key: page.id}" [fragment]="page.collectionKey">Edit Page</a>
  <a mat-menu-item  (click)="onDelete(page)">Delete</a>
  </mat-menu>
  <a routerLink="{{page.title | slugify }}/{{page.id}}"
  [fragment]="page.collectionKey" [fragment]="page.collectionKey" mat-raised-button class="checkit"> Check it</a>
     <mat-card class="collection-card  page-cart">
         <img mat-card-image mat-elevation-z2 [src]="page.photoURL" [alt]="page.title">
         <div class="collection-img">
             <img [src]="page.photoURL" class="img-thumbnail" [alt]="">
         </div>
         <mat-card-title><a routerLink="{{page.title | slugify }}/{{page.id}}"
         [fragment]="page.collectionKey">{{page.title | shorten: 100:'..'}}</a></mat-card-title>
         <mat-card-subtitle>
             {{page.uid}}
         </mat-card-subtitle>
         <mat-card-content>
           <p>
               {{page.description | shorten: 100:'..'}}
           </p>
         </mat-card-content>
       </mat-card>
       </ng-container>
  </div>
  <div class="row text-center">
  <div class="col-md-12">
  <app-ads-content-match></app-ads-content-match>
  </div>
</div>
<ng-container class="mar-30" *ngIf="pages.length < 1">
<div class="row">
   <div class="col-md-8">
    <div class="display-5 text-center">
        <mat-card class="mar-20">
          <h1>In this collection, you can post blogs, forums, photos, videos on this topic.</h1>
        </mat-card>
        <img class="img-thumbnails no-content" src="./assets/forums.png" alt="Not Pages Yet">
        <div>No Pages Yet! Be the First!</div>
        <a routerLink="/collections/addpage"
        [queryParams]="{allow:'1'}"
        [fragment]="collectionKey">Create a page</a>
      </div>
   </div>
   <div class="col-md-4">
      <app-ads-right></app-ads-right>
   </div>
</div>
</ng-container>
</div>
  `,
  /*
    <ng-masonry-grid
  [masonryOptions]="{ transitionDuration: '0.4s', gutter: 15 }"
  [useAnimation]="true"
  [useImagesLoaded]="true"
  [scrollAnimationOptions]="{ animationEffect: 'effect-4', minDuration : 0.4, maxDuration : 0.7 }"
   >
    <ng-masonry-grid
  [masonryOptions]="{ transitionDuration: '0.4s', gutter: 15 }"
  [useAnimation]="true"
  [useImagesLoaded]="true"
  [scrollAnimationOptions]="{ animationEffect: 'effect-4', minDuration : 0.4, maxDuration : 0.7 }"
   >
     <ng-masonry-grid-item>
  <app-ads-right-2></app-ads-right-2>
  </ng-masonry-grid-item>
</ng-masonry-grid>
   */
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
export class PagesComponent implements OnInit, OnDestroy {
  @ViewChild('pageRef') pageRef: ElementRef;
  collections;
  pages;
  sub: Subscription;
  collectionKey: string;
  collectionTitle: string;
  collection: Observable<any>;
  public loading$: Observable<boolean>;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    private _session: SessionService,
    private _title: Title,
    private _meta: Meta,
    private _ucFirst: UcFirstPipe,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private _masonry: NgMasonryGridService,
    private store: Store<fromPage.State>
  ) {
    this.loading$ = this.store.pipe(select(fromPage.getLoading));
   }

  ngOnInit() {
  const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
  this.pageScrollService.start(pageScrollInstance);
  this.sub = this._route.fragment.subscribe(
    (collectionkey: string) => {
      this.collectionKey = collectionkey;
     this.collections = this.store.select(fromPage.selectAll);
      this.store.dispatch(  new pageActions.Query() );
      this.collections.subscribe(data => {
        this.pages =  data.filter((item) => {
           return item.collectionKey === collectionkey;
         });
        const page = this.pages[0];
        if (page) {
             this.collectionTitle = page.collection;
        }
        this._title.setTitle(this._ucFirst.transform(this.collectionTitle) + ' Pages');
        this._meta.addTags([
          { name: 'keywords',
          content: this._ucFirst.transform(this.collectionTitle) + ' Pages' + this._ucFirst.transform(this.collectionTitle) + 'Blogs'},
          { name: 'description',
           content: this._ucFirst.transform(this.collectionTitle) + ' Pages and blogs contributed by collection subscribers.' }
        ]);
       });
    });


  /*this.collections = this._collections.collections;
   this.sub = this._route.fragment
    .subscribe(
      (fragment: string) => {
        this._collections.getCollection(fragment).subscribe((collection: Collection) => {
          this._collections.getCollectionPages(fragment, collection.title).subscribe(
            (pages) => {
              this.collection = collection;
              this.collectionKey = fragment;
               this.pages = pages;
               this._title.setTitle(this._ucFirst.transform(collection.title) + ' Pages');
               this._meta.addTags([
                 { name: 'keywords',
                 content: this._ucFirst.transform(collection.title) + ' Pages' + this._ucFirst.transform(collection.title) + 'Blogs'},
                 { name: 'description',
                  content: this._ucFirst.transform(collection.title) + ' Pages and blogs contributed by collection subscribers.' }
               ]);
            });
        });
      });*/
  }

  onDelete (page: Page) {
    this._collections.onDeletePage(page);
    this.removeGridItem(page);
  }

  private removeGridItem($event){}
  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
