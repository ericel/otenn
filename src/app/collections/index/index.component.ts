import { Component, OnInit } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Collection } from '@collections/state/collections.model';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '@shared/services/session.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css', './ng-masonry-grid.css']
})
export class IndexComponent implements OnInit {
  collections;
  showMasonry = true;

  animOptions = { animationEffect: 'effect-1' };
  constructor(private _collections: CollectionsService,
  public _sessions: SessionService
  ) { }

  ngOnInit() {
    this._sessions.hide();
    this._collections.getAllCollections().subscribe(
      (collections) => {
        this.collections = collections;
      });
  }

}

@Component({
  selector: 'app-collections-main',
  templateUrl: './main.component.html',
})
export class CollectionsStartComponent implements OnInit {

  constructor(

  ) { }

  ngOnInit () {

  }

}

