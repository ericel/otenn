import { Component, OnInit, OnDestroy, Inject, ElementRef, ViewChild } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Collection } from '@collections/state/models/collection.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import {trigger, transition, style, animate, state, keyframes} from '@angular/animations';

import { Title, Meta } from '@angular/platform-browser';
import { UcFirstPipe } from 'ngx-pipes';

import { Store, select } from '@ngrx/store';
import * as forumActions from '@collections/state/actions/forum.actions';
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';
import { Forum } from '@collections/state/models/forum.model';
import { AuthService } from '../../../auth/state/auth.service';
@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
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
export class ForumsComponent implements OnInit, OnDestroy {
  @ViewChild('pageRef') pageRef: ElementRef;
  collection;
  sub: Subscription;
  collectionKey: String;
  forums;
  forum_view = true;
  forum_new = false;
  loading$: Observable<boolean>;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private _title: Title,
    private _meta: Meta,
    private _ucFirst: UcFirstPipe,
    private store: Store<fromStore.State>,
    public _auth: AuthService
  ) {
    this.loading$ = this.store.pipe(select(fromStore.getLoadingForum));
   }

  ngOnInit() {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
    this.sub = this._route.fragment
    .subscribe(
      (collectionKey: string) => {
      this._collections.getCollection(collectionKey).subscribe((collection: Collection) => {
       this.collection = collection;
       this.collectionKey = collectionKey;

       this._title.setTitle(this._ucFirst.transform(this.collection.title) + ' Forums');
       this._meta.addTags([
         { name: 'keywords',
         content: this._ucFirst.transform(this.collection.title) + ' Forums' + this._ucFirst.transform(this.collection.title) + 'Blogs'},
         { name: 'description',
          content: this._ucFirst.transform(this.collection.description) + ' Forums and blogs contributed by collection subscribers.' }
       ]);
    });

     const forums = this.store.select(fromStore.getAllForums);
      this.store.dispatch(  new forumActions.Query() );
       forums.subscribe(data => {
        const forumsAll =  data.filter((item) => {
           return (item.collectionKey === collectionKey) && (item.status === 'Published');
         });

         if(forumsAll) {
           this.forums = forumsAll;
         }
       });
  });

  }


  onNewThread() {
   this.forum_view = !this.forum_view;
   this.forum_new = !this.forum_new;
  }

  newThread(e){
    this.forum_view = !this.forum_view;
    this.forum_new = !this.forum_new;
  }
  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
