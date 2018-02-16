import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Collection } from '@collections/state/models/collection.model';
import { Subscription } from 'rxjs/Subscription';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { UcFirstPipe } from 'ngx-pipes';
import { Title, Meta } from '@angular/platform-browser';

import { Store, select } from '@ngrx/store';
import * as forumActions from '@collections/state/actions/forum.actions';
import * as fromStore from '@collections/state';
import { Observable } from 'rxjs/Observable';
import { Forum } from '@collections/state/models/forum.model';
import { AuthService } from '../../../../auth/state/auth.service';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
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
export class ForumComponent implements OnInit, OnDestroy {
@ViewChild('pageRef') pageRef: ElementRef;
@ViewChild('replyRef') replyRef: ElementRef;
collection: Collection;
sub: Subscription;
loading$: Observable<boolean>;
forums; forum;
reply_new = false;
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
   this.sub = this._route.fragment.subscribe( (collectionkey: string) => {
      this._collections.getCollection(collectionkey).subscribe(
        (collection: Collection) => {
            this.collection = collection;
        });

       const forums = this.store.select(fromStore.getAllForums);
         this.store.dispatch(  new forumActions.Query() );
         forums.subscribe(data => {
           this.forums =  data.filter((item) => {
              return item.collectionKey === collectionkey && item.status !== 'Unpublished';
            });
           this._route.params.subscribe((section: Params) => {
             this.forum =  data.filter((item) => {
               return item.id === section['key'];
             });

            const forum = this.forum[0];
             if (forum) {
                this.forum = this.forum[0];
                 const title = forum.title;
                 const description = forum.description;
           this._title.setTitle(this._ucFirst.transform(title));
           this._meta.addTags([
             { name: 'keywords',
             content: this._ucFirst.transform(title)  + this._ucFirst.transform(title) + 'Blogs'},
             { name: 'description',
              content: this._ucFirst.transform(title) + this._ucFirst.transform(description) }
           ]);
          }
         });
        });
    });
  }

  onReply() {
    this.reply_new = !this.reply_new;
  }

  onReplyButton($event) {
   this.reply_new = true;
  if(this.reply_new) {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.replyRef.nativeElement);
    this.pageScrollService.start(pageScrollInstance);
  }
  }

  replyClose($event) {
    this.reply_new = !this.reply_new;
  }

  onDelete(id) {
   if(confirm('Are you sure to delete thread?')){
    this._collections.getCommentCount(id, 'forumId', 'o-t-forum-replies').subscribe((comments) => {
      const commentCount =  comments.length;
      console.log(commentCount)
      if(commentCount > 1){
        this._collections.deleteCollection('o-t-forum-replies', commentCount, id, 'forumId').subscribe((status) => {
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
      this.store.dispatch( new forumActions.Delete(id));
    }, 2000)
  }
  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
