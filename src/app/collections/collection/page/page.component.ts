import { Component, OnInit } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import {trigger, transition, style, animate, state} from '@angular/animations';
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
    private _collections: CollectionsService
  ) { }

  ngOnInit() {
    this.collections = this._collections.collections;
  }

}

@Component({
  selector: 'app-pages',
  template: `
  <div class="gutter-2 row " [@myAnimation]>
  <div class="col-lg-3" *ngFor="let collection of collections">
      <a routerLink="/collections/{{collection.title | slugify }}/{{collection.description | slugify }}"
       fragment="839478">
        <button mat-raised-button class="checkit"> Check it</button>
         <mat-card class="collection-card mar-20" [style.background]="collection.color">
             <img mat-card-image mat-elevation-z2 [src]="collection.photoURL" alt="Photo of a Shiba Inu">
             <div class="collection-img">
                 <img [src]="collection.photoURL" class="img-thumbnail">
             </div>
             <mat-card-subtitle class="text-muted">
                 {{collection.creator}}
             </mat-card-subtitle>
             <mat-card-content>
               <p>
                   {{collection.description | shorten: 100:'..'}}
               </p>
             </mat-card-content>
           </mat-card>
      </a>
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
  constructor(
    private _collections: CollectionsService
  ) { }

  ngOnInit() {
    this.collections = this._collections.collections;
  }

}
