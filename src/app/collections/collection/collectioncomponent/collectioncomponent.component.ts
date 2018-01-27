import { Component, OnInit } from '@angular/core';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { CollectionsService } from '@collections/state/collections.service';
@Component({
  selector: 'app-collectioncomponent',
  templateUrl: './collectioncomponent.component.html',
  styleUrls: ['./collectioncomponent.component.css'],
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
export class CollectioncomponentComponent implements OnInit {
collections;
  constructor(private _collections: CollectionsService) { }

  ngOnInit() {
    this.collections = this._collections.getAllCollections();
  }

}
