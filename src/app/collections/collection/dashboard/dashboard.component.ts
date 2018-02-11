import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Page } from '@collections/state/models/page.model';
import { Store, select } from '@ngrx/store';
import * as pageActions from '@collections/state/actions/page.actions';
import * as fromStore from '@collections/state';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
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
  sub: Subscription;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  constructor(
    private _route: ActivatedRoute,
    private store: Store<fromStore.State>
  ) { }

  ngOnInit() {
    this.sub = this._route.fragment.subscribe(
      (collectionKey: string) => {
       this.pages = this.store.select(fromStore.getAllPages);
        this.store.dispatch(  new pageActions.Query() );
        this.pages.subscribe(pagesAll => {
        this.data = pagesAll.filter((item) => {
          return item.collectionKey === collectionKey;
        });
          this.dataSource = new MatTableDataSource(this.data);
       });
   });
  }


  approve(id, status){
    if(status === 'Unpublished') {
      const con = confirm('Are you sure you want to unpublish this page?')
    }
    this.pages.subscribe(pagesAll => {
      const page = pagesAll.filter((item) => {
        return item.id === id;
      });
     if(page) {
      const newPage = new Page(page[0].id, page[0].title, page[0].description, page[0].page, page[0].photoURL, status,
         page[0].collection, page[0].component,
         page[0].createdAt, page[0].updatedAt, page[0].collectionKey, page[0].uid);
         this.store.dispatch( new pageActions.Update(id, newPage) );


     }

    });

  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}


