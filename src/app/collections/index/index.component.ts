import { Component, OnInit } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Collection } from '@collections/state/collections.model';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '@shared/services/session.service';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta } from '@angular/platform-browser';


import { Store } from '@ngrx/store';
import * as actions from '@collections/state/collections.actions';
import * as fromCollection from '@collections/state/collections.reducer';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{
  collections: Observable<any>;
  sub: Subscription;
  constructor(private _collections: CollectionsService,
  public _sessions: SessionService,
  private _title: Title,
  private _meta: Meta,
  private store: Store<fromCollection.State>
  ) {

  }

  ngOnInit() {
    this._title.setTitle('Otenn Web Collections');
    this._meta.addTags([
      { name: 'keywords', content: 'Blogs, forums, videos, photos, collections, otenn collections, afro collections'},
      { name: 'description', content: 'Otenn web collections' }
    ]);

   this.collections = this.store.select(fromCollection.selectAll);
   this.store.dispatch(  new actions.Query() );
   this._sessions.hide();
   /*this.sub = this._collections.getAllCollections().subscribe(
      (collections) => {
        this.collections = collections;
      });
      */

      console.log(this.collections);
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

