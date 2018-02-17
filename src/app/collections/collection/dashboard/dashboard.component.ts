import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Page } from '@collections/state/models/page.model';
import { Store, select } from '@ngrx/store';
import * as collectionActions from '@collections/state/actions/collection.actions';
import * as fromStore from '@collections/state';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title, Meta } from '@angular/platform-browser';
import { Collection } from '@collections/state/models/collection.model';
@Component({
  selector: 'app-dashboard',
  templateUrl:'./dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns = ['id', 'title', 'photo', 'status'];
  ELEMENT_DATA = [];
  dataSource;
  data;
  pages;
  collection;
  sub: Subscription;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  constructor(
    private _route: ActivatedRoute,
    private _title: Title,
    private _meta: Meta,
    private store: Store<fromStore.State>
  ) { }

  ngOnInit() {
    this._title.setTitle('Collection Admins Dashboard');
    this._meta.addTags([
      { name: 'keywords', content: 'Collection Admins Dashboard'},
      { name: 'description', content: 'Collection Admins Dashboard' }
    ]);
    this.sub = this._route.fragment.subscribe(
      (collectionKey: string) => {
       const collections = this.store.select(fromStore.getAllCollections);
        this.store.dispatch(  new collectionActions.Query() );
       if(collectionKey) {
        collections.subscribe(data => {
          this.collection =  data.filter((item) => {
             return item.id === collectionKey;
           });
          this.collection = this.collection[0];

         });
       }
      });

  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}


