import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { ActivatedRoute } from '@angular/router';
import { Collection } from '@collections/state/models/collection.model';
import { Subscription } from 'rxjs/Subscription';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import {  PageScrollConfig, PageScrollService, PageScrollInstance } from 'ngx-page-scroll';
import { UcFirstPipe } from 'ngx-pipes';
import { Title, Meta } from '@angular/platform-browser';
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
collection: Collection;
sub: Subscription;
  constructor(
    private _collections: CollectionsService,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private _title: Title,
    private _meta: Meta,
    private _ucFirst: UcFirstPipe
  ) {}

  ngOnInit() {
  const pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, this.pageRef.nativeElement);
  this.pageScrollService.start(pageScrollInstance);
   this.sub = this._route.fragment.subscribe( (Collectionkey: string) => {
      this._collections.getCollection(Collectionkey).subscribe(
        (collection: Collection) => {
            this.collection = collection;
        });
    });

    /*   this._title.setTitle(this._ucFirst.transform(page.title));
                this._meta.addTags([
                  { name: 'keywords',
                  content: this._ucFirst.transform(page.title) + ',' + this._ucFirst.transform(collection.title) + 'page'},
                  { name: 'description',
                  content: this._ucFirst.transform(page.description) }
                ]);
                */
  }


  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
