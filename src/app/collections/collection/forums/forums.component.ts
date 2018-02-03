import { Component, OnInit, OnDestroy, Inject, ElementRef, ViewChild } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Collection } from '@collections/state/models/collection.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import {trigger, transition, style, animate, state, keyframes} from '@angular/animations';
@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
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
export class ForumsComponent implements OnInit, OnDestroy {
  @ViewChild('pageRef') pageRef: ElementRef;
  collection;
  sub: Subscription;
  collectionKey: String;
  forums;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
  ) { }

  ngOnInit() {
    this.forums = this._collections.collections;
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
    this.sub = this._route.fragment
    .subscribe(
      (collectionKey: string) => {
      this._collections.getCollection(collectionKey).subscribe((collection: Collection) => {
       this.collection = collection;
       this.collectionKey = collectionKey;
    });
  });
  }


  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
