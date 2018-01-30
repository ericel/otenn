import { Component, OnInit, OnDestroy } from '@angular/core';
import { CollectionsService } from '@collections/state/collections.service';
import { Collection } from '@collections/state/collections.model';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '@shared/services/session.service';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  collections;
  sub: Subscription;
  constructor(private _collections: CollectionsService,
  public _sessions: SessionService,
  private _title: Title,
  private _meta: Meta,
  ) {

  }

  ngOnInit() {
    this._title.setTitle('Otenn Web Collections');
    this._meta.addTags([
      { name: 'keywords', content: 'Blogs, forums, videos, photos, collections, otenn collections, afro collections'},
      { name: 'description', content: 'Otenn web collections' }
    ]);

   this._sessions.hide();
   this.sub = this._collections.getAllCollections().subscribe(
      (collections) => {
        this.collections = collections;
      });
  }

  ngOnDestroy () {
    this.sub.unsubscribe();
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

