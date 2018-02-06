import { Component, OnInit } from '@angular/core';
import { Collection } from '@collections/state/models/collection.model';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '@shared/services/session.service';
import { Title, Meta } from '@angular/platform-browser';


import { Store, select } from '@ngrx/store';
import * as actions from '@collections/state/actions/collection.actions';
import * as fromCollection from '@collections/state/reducers/collection.reducer';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{
  collections: Observable<any>;
  public loading$: Observable<boolean>;
  constructor(
  public _sessions: SessionService,
  private _title: Title,
  private _meta: Meta,
  private store: Store<fromCollection.State>
  ) {
    this.loading$ = this.store.pipe(select(fromCollection.getLoading));
  }

  ngOnInit() {
    this._title.setTitle('Otenn Web Collections');
    this._meta.addTags([
      { name: 'keywords', content: 'Blogs, forums, videos, photos, collections, otenn collections, afro collections'},
      { name: 'description', content: 'Otenn web collections' }
    ]);
  this.collections = this.store.pipe(select(fromCollection.selectAll))
  this.store.dispatch(  new actions.Query() );
   this._sessions.hide();
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

