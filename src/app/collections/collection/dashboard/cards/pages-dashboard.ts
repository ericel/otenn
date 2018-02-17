import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import {MatTableDataSource} from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as pageActions from '@collections/state/actions/page.actions';
import * as fromStore from '@collections/state';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from "@angular/router";
import { Page } from "@collections/state/models/page.model";
import { CollectionsService } from "@collections/state/collections.service";
@Component({
  selector: 'pages-dashboard',
  template: `
  <ng-container *ngIf="data.length > 0 then  pages else noPages"></ng-container>
  <ng-template #pages>
  <div class="card mar-30">
     <div class="card-block">
        <div class="table-container mat-elevation-z8">
            <div class="table-header">
              <mat-form-field>
                <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
              </mat-form-field>
            </div>

            <mat-table #table [dataSource]="dataSource">

              <!-- id Column -->
              <ng-container matColumnDef="id">
                <mat-header-cell *matHeaderCellDef> No. </mat-header-cell>
                <mat-cell *matCellDef="let element">
                <a  routerLink="">
                  <img [src]="element.avatar" [alt]="element.username" class="img-thumbnail photo-user">
                  {{element.username}}
                </a>
                <br> {{element.updatedAt}}
                </mat-cell>
              </ng-container>

              <!-- title Column -->
              <ng-container matColumnDef="title">
                <mat-header-cell *matHeaderCellDef> Title </mat-header-cell>
                <mat-cell *matCellDef="let element">
                <a routerLink="/collections/{{element.collection | slugify }}/pages/{{element.title | slugify }}/{{element.id}}"
                  [fragment]="element.collectionKey">{{element.title}}</a>  </mat-cell>
              </ng-container>

              <!-- photo Column -->
              <ng-container matColumnDef="photo">
                <mat-header-cell *matHeaderCellDef> Photo </mat-header-cell>
                <mat-cell *matCellDef="let element"> <img [src]="element.photoURL" class="img-thumbnail" [alt]="element.title"> </mat-cell>
              </ng-container>

              <!-- status Column -->
              <ng-container matColumnDef="status">
                <mat-header-cell *matHeaderCellDef> Status </mat-header-cell>
                  <mat-cell *matCellDef="let element">
                      <ng-container  *ngIf="element.status !== 'Draft' && element.status !== 'Published' ">
                        <button mat-raised-button (click)="approve(element.id, 'Published')" color="warn">Click to Approve </button>
                     </ng-container>
                     <ng-container  *ngIf="element.status === 'Draft'">
                        <button mat-raised-button disabled (click)="approve(element.id)">Still Draft</button>
                     </ng-container>
                     <ng-container  *ngIf="element.status === 'Published'">
                        <button mat-raised-button  color="primary" (click)="approve(element.id, 'Unpublished')">Unapproved Page</button>
                     </ng-container>
                     <button mat-button (click)="onDelete(element.id)">Delete Page</button>
                  </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>
          </div>
     </div>
  </div>
</ng-template>
<ng-template #noPages>
    no pages to manage yet!
</ng-template>
  `,
  styleUrls: ['./../dashboard.component.css']
})
export class PagesDashboard implements OnInit, OnDestroy {
  @Input() collection;
  displayedColumns = ['id', 'title', 'photo', 'status'];
  ELEMENT_DATA = [];
  dataSource;
  data;
  pages;
  sub: Subscription;
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  constructor( private _route: ActivatedRoute,
    private store: Store<fromStore.State>,
    private _collections: CollectionsService
  ) {

  }

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

  onDelete(id) {
    if (confirm('Are you sure you want to delete this page and properties?')){
      this._collections.getCommentCount(id, 'pageId', 'o-t-pages-comments').subscribe((comments) => {
        const commentCount =  comments.length;
        if(commentCount > 1){
          this._collections.deleteCollection('o-t-pages-comments', commentCount, id, 'pageId').subscribe((status) => {
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
      this.store.dispatch( new pageActions.Delete(id));
    }, 2000)
  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
