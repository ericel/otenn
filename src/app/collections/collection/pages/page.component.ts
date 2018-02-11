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
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/auth/state/auth.service';
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
    private store: Store<fromStore.State>,
    public _auth: AuthService
  ) {
    this.loading$ = this.store.pipe(select(fromStore.getLoadingPage));
   }

  ngOnInit() {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
    this.sub = this._route.fragment.subscribe(
      (collectionkey: string) => {
      this.collectionKey = collectionkey;
       this.collections = this.store.select(fromStore.getAllPages);
        this.store.dispatch(  new pageActions.Query() );
        this.collections.subscribe(data => {
          this.pages =  data.filter((item) => {
             return item.collectionKey === collectionkey && item.status !== 'Unpublished';
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
    if (confirm('Are you sure you want to delete this page and properties?')){
      this._collections.getCommentCount(id).subscribe((comments) => {
        const commentCount =  comments.length;
        if(commentCount > 1){
          this._collections.deleteCollection('o-t-pages-comments', commentCount, id).subscribe((status) => {
            this.deletePage(id);
          });
        } else {
          this.deletePage(id);
        }
      });
    }
  }

  private deletePage(id) {
    setTimeout(() => {
      this.store.dispatch( new pageActions.Delete(id));
    }, 2000)
  }
}

@Component({
  selector: 'app-pages',
  providers: [UcFirstPipe],
  template: `
  <div  #pageRef></div>
  <section  *ngIf="pages && (pages.length > 0) && (loading$ | async)">
  <div  class="main-collect row" >
  <div  class="main-collect pag-1 col-md-4 mar-20" *ngFor="let page of pages">
  <a routerLink="{{page.title | slugify }}/{{page.id}}"
  [fragment]="page.collectionKey"  mat-raised-button class="checkit"> Check it</a>
    <loading [load]="deleting" class="card-loader"></loading>
        <button class="menu-button" mat-icon-button [matMenuTriggerFor]="pageMenu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #pageMenu="matMenu" xPosition="before">
      <div *ngIf="_auth.user | async; then authenticated else guest"></div>
      <ng-template #guest>
         <a mat-menu-item>Report</a>
      </ng-template>
      <ng-template #authenticated>
        <ng-container *ngIf="_auth.user | async as user">
            <a mat-menu-item>Report</a>
            <a mat-menu-item *ngIf=" user.uid === page.uid" routerLink="/collections/editpage/{{page.title | slugify}}"
            [queryParams]="{ key: page.id}" [fragment]="page.collectionKey">Edit Page</a>
            <a mat-menu-item *ngIf=" user.uid === page.uid" (click)="onDelete(page.id)">Delete</a>
        </ng-container>
      </ng-template>
     </mat-menu>
      <mat-card class="collection-card">
          <img mat-card-image mat-elevation-z2 [src]="page.photoURL" alt="{{page.title}}">
          <div class="collection-img">
            <img [src]="page.avatar" class="img-thumbnail" [alt]="page.username">
        </div>
          <mat-card-title class="collection-name">
              {{page.collection}}
          </mat-card-title>
          <mat-card-subtitle class="text-muted">
              {{page.username}}
          </mat-card-subtitle>
          <mat-card-title><a routerLink="{{page.title | slugify }}/{{page.id}}"
          [fragment]="page.collectionKey">{{page.title | shorten: 100:'..'}}</a></mat-card-title>
        </mat-card>
</div>
       </div>
       <app-ads-content-match></app-ads-content-match>
</section>


<loading [load]="(loading$ | async)"></loading>
<div class="row mar-30" *ngIf="pages && pages.length==0">
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
export class PagesComponent implements OnInit, OnDestroy {
  @ViewChild('pageRef') pageRef: ElementRef;
  collections;
  pages;
  sub: Subscription;
  collectionKey: string;
  collectionTitle =  'Collection';
  collection: Observable<any>;
  public loading$: Observable<boolean>;
  deleting =  true;
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
    private store: Store<fromStore.State>,
    public _auth: AuthService
  ) {
    this.loading$ = this.store.pipe(select(fromStore.getLoading));
   }

  ngOnInit() {
  const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
  this.pageScrollService.start(pageScrollInstance);
  this.sub = this._route.fragment.subscribe(
    (collectionkey: string) => {
      this.collectionKey = collectionkey;
     this.collections = this.store.select(fromStore.getAllPages);
      this.store.dispatch(  new pageActions.Query() );
      this.collections.subscribe(data => {
        this.pages =  data.filter((item) => {
           return (item.collectionKey === collectionkey) && (item.status === 'Published');
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
  }

  onDelete (id: string) {
    if (confirm('Are you sure you want to delete this page and properties?')){
      this.deleting = false;

      this._collections.getCommentCount(id).subscribe((comments) => {
        const commentCount =  comments.length;
        if(commentCount > 1){
          this._collections.deleteCollection('o-t-pages-comments', commentCount, id).subscribe((status) => {
            this.deletePage(id);
          });
        } else {
          this.deletePage(id);
        }
      });
    }
  }

  private deletePage(id) {
    setTimeout(() => {
      this.deleting = true;
      this.store.dispatch( new pageActions.Delete(id));
    }, 2000)
  }
  /*trackByFn(item, index){
    console.log(index)
  }*/
  private removeGridItem($event){}
  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
