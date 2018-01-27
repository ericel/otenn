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
