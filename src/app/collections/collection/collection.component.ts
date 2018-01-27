import { Component, OnInit, OnDestroy,
  ViewChild, ElementRef, HostListener,
  PLATFORM_ID, Inject,
  Output, EventEmitter,
  Input
} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import { WINDOW } from '@shared/services/windows.service';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { Collection } from '@collections/state/collections.model';
import { CollectionsService } from '@collections/state/collections.service';
import { UcFirstPipe } from 'ngx-pipes';
import { SessionService } from '@shared/services/session.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  providers: [UcFirstPipe],
})
export class CollectionComponent implements OnInit, OnDestroy {
  @ViewChild('router') route: ElementRef;
  sub: Subscription;
  collection;
  verticalOffset;
  isMini: boolean = false;
  photo = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject( WINDOW) private window,
    private pageScrollService: PageScrollService,
    private _collections: CollectionsService,
    private _ucfirst: UcFirstPipe,
    public _sessions: SessionService
  ) { }

  ngOnInit() {
  this.sub = this._route.fragment.subscribe(
    (fragment: string) => {
      this._collections.getCollection(fragment).subscribe(
        (collection: Collection) => {
          this.collection = collection;
      });
    });

  this._sessions.hide();
  }

  onRoute(e) {
    if (this.verticalOffset < 300) {
         this.isMini = true;
    }
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.route.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener("window:scroll", []) onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
    this.verticalOffset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

     if (this.verticalOffset > 300 ) {
       this.isMini = true;
     } else {
     this.isMini = false;
     }
    }
   }
}


@Component ({
  selector: 'collection-menu',
  template: `
  <ng-container *ngIf="collection">

  <img mat-card-image [src]="collection.photoURL" [alt]="collection.title">
  <div class="creator">
    <img [src]="photo" class="img-thumbnail ">
   <div class="font-weight-bold">Oj Obasi</div>
 </div>
 <button class="menu-button" mat-icon-button [matMenuTriggerFor]="collectionmenu">
  <mat-icon>more_vert</mat-icon>
 </button>
 <mat-menu #collectionmenu="matMenu" xPosition="before">
  <a mat-menu-item>Report</a>
  <a mat-menu-item routerLink="/collections/editcollection/{{collection.title | slugify}}"
  [queryParams]="{ allow: 1}" [fragment]="collection.$key">Edit Collection</a>
</mat-menu>
  <div class="card-content afix" >
     <mat-list>
          <h1 class="h4 text-center"><a class="title" routerLink="/collections/c/{{collection.title | slugify}}" fragment="{{collection.$key}}"
            pageScroll href="#home">
          <i class="fa fa-home" aria-hidden="true"></i>
              {{collection.title | uppercase | shorten: 20:''}}
          </a>
        </h1>
            <mat-divider></mat-divider>
              <a routerLink="pages" mat-list-item routerLinkActive="active" class="text-center" fragment="{{collection.$key}}" (click)="onRoute($event)" >
                 <mat-icon mat-list-icon>pages</mat-icon>
                   <h4 mat-line> Pages</h4>
                      <p mat-line> {{collection.createdAt | date}} </p>
              </a>
              <a routerLink="forums" mat-list-item routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                 <mat-icon mat-list-icon>forums</mat-icon>
                  <h4 mat-line> Forums</h4>
                    <p mat-line> {{collection.createdAt | date}} </p>
              </a>
              <a routerLink="videos" mat-list-item routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                   <mat-icon mat-list-icon>photo_library</mat-icon>
                   <h4 mat-line> Videos</h4>
                    <p mat-line> {{collection.createdAt | date}} </p>
              </a>
               <a routerLink="photos" mat-list-item routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                     <mat-icon mat-list-icon>video_library</mat-icon>
                      <h4 mat-line> Photos</h4>
                  <p mat-line> {{collection.createdAt | date}} </p>
                </a>
      </mat-list>
        <div class="card-content" >
             <div class="card-header">
               <h4>Collections Social</h4>
               </div>
              <div class="card-block text-center padding-10">
               <app-share></app-share>
              </div>
          </div>
        </div>
  </ng-container>
  `,
  styleUrls: ['./collection.component.css']
})

export class CollectionMenu implements OnInit {
  @Input() collection: any;
  @Output() route = new EventEmitter<void>();
  photo = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  constructor (

  ) {}

  ngOnInit () {

  }

  onRoute(e) {
    this.route.emit(e);
  }
}


@Component ({
  selector: 'collection-updates',
  template: `
  <ng-container *ngIf="collection">
  <mat-card class=" mar-20">
  <mat-card-content>
    <div>
       <img [src]="photo" class="img-thumbnail" alt="update username">
    </div>
    <div>
       <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
    </div>
    <mat-card-title  class="mar-20">Angular — Animating Router transitions (v4+)</mat-card-title>
  </mat-card-content>
</mat-card>
<mat-card class=" mar-20">
   <mat-card-content>
     <div   class="mar-10">
        <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
     </div>
     <mat-card-title>Angular — Animating Router transitions (v4+)</mat-card-title>
   </mat-card-content>
 </mat-card>
 <mat-card class=" mar-20">
     <mat-card-content>
       <div>
          <img [src]="photo" class="img-thumbnail" alt="update username">
       </div>
       <div>
          <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
       </div>
       <mat-card-title  class="mar-20">Angular — Animating Router transitions (v4+)</mat-card-title>
     </mat-card-content>
   </mat-card>
   <mat-card class=" mar-20">
      <mat-card-content>
        <div   class="mar-10">
           <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
        </div>
        <mat-card-title>Angular — Animating Router transitions (v4+)</mat-card-title>
      </mat-card-content>
    </mat-card>
    <mat-card class=" mar-20">
       <mat-card-content>
         <div>
            <img [src]="photo" class="img-thumbnail" alt="update username">
         </div>
         <div>
            <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
         </div>
         <mat-card-title  class="mar-20">Angular — Animating Router transitions (v4+)</mat-card-title>
       </mat-card-content>
     </mat-card>
     <mat-card class=" mar-20">
        <mat-card-content>
          <div   class="mar-10">
             <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
          </div>
          <mat-card-title>Angular — Animating Router transitions (v4+)</mat-card-title>
        </mat-card-content>
      </mat-card>
      <mat-card class=" mar-20">
         <mat-card-content>
           <div   class="mar-10">
              <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
           </div>
           <mat-card-title>Angular — Animating Router transitions (v4+)</mat-card-title>
         </mat-card-content>
       </mat-card>
       <mat-card class=" mar-20">
          <mat-card-content>
            <div>
               <img [src]="photo" class="img-thumbnail" alt="update username">
            </div>
            <div>
               <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
            </div>
            <mat-card-title  class="mar-20">Angular — Animating Router transitions (v4+)</mat-card-title>
          </mat-card-content>
        </mat-card>
        <mat-card class=" mar-20">
           <mat-card-content>
             <div   class="mar-10">
                <img [src]="photo" class="img-thumbnail admins-img" alt="update username"> Oj Obasi posted a new blog <span>10 mins ago</span>
             </div>
             <mat-card-title>Angular — Animating Router transitions (v4+)</mat-card-title>
           </mat-card-content>
         </mat-card>
  </ng-container>
  `,
  styleUrls:  ['./collection.component.css']
})

export class CollectionUpdates implements OnInit {
  @Input() collection: any;
  photo = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  constructor(
    private _collection: CollectionsService
  ){}

  ngOnInit() {

  }
}

@Component({
  selector: 'collection-header',
  template: `
  <mat-card class="header" *ngIf="collection"
  [style.background]="collection.color"
  >
   <div class="creator">
      <img [src]="photo" class="img-thumbnail admins-img">
      <div class="font-weight-bold">Oj Obasi</div>
   </div>
<!-- [ngStyle]="isMini && {'background-image': 'url(' + photo + ')'}"-->
      <div class="row " [ngClass]="[isMini ? 'header-mini animated finite slideInDown' : 'mar-20-minus']">
          <div class="col-md-3">
            <a routerLink="blogs" routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                <mat-card  class="w-100 nopadding">
                    <span class="h5  justify-vertically"><mat-icon>pages</mat-icon> Pages</span>
                </mat-card>
            </a>
          </div>
          <div class="col-md-3">
              <a routerLink="forums" routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                  <mat-card  class="w-100 nopadding">
                      <span class="h5  justify-vertically"><mat-icon>forum</mat-icon> Forums</span>
                  </mat-card>
              </a>
           </div>
           <div class="col-md-3">
              <a routerLink="photos" routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                  <mat-card  class="w-100 nopadding">
                      <span class="h5  justify-vertically"><mat-icon>photo_library</mat-icon> Photos</span>
                  </mat-card>
              </a>
           </div>
           <div class="col-md-3">
              <a routerLink="videos" routerLinkActive="active" fragment="{{collection.$key}}" (click)="onRoute($event)">
                  <mat-card  class="w-100 nopadding">
                      <span class="h5  justify-vertically"><mat-icon>video_library</mat-icon> Videos</span>
                  </mat-card>
              </a>
           </div>
        </div>

 </mat-card>`,
 styleUrls: ['./collection.component.css']
})

export class CollectionHeader implements OnInit {
  @Input() collection: any;
  @Output() route = new EventEmitter<void>();
  photo = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  constructor(
    private _collection: CollectionsService
  ){}

  ngOnInit () {

  }

  onRoute(e) {
    this.route.emit(e);
  }
}

export const COLLECTION_COMPONENTS = [
  CollectionComponent,
  CollectionMenu,
  CollectionUpdates,
  CollectionHeader
]
