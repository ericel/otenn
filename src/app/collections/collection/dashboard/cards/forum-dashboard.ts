import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import {MatTableDataSource} from '@angular/material';
import { Store, select } from '@ngrx/store';
import * as forumActions from '@collections/state/actions/forum.actions';
import * as fromStore from '@collections/state';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from "@angular/router";
import {Forum } from "@collections/state/models/forum.model";
import { CollectionsService } from "@collections/state/collections.service";
@Component({
  selector: 'forums-dashboard',
  template: `
  <ng-container *ngIf="data.length > 0 then  forums else noforums"></ng-container>
  <ng-template #forums>
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
                <a routerLink="">
                <img [src]="element.avatar" [alt]="element.username" class="img-thumbnail photo-user">
                {{element.username}}
                </a>
                <br> {{element.updatedAt}} </mat-cell>
              </ng-container>

              <!-- title Column -->
              <ng-container matColumnDef="title">
                <mat-header-cell *matHeaderCellDef> Title </mat-header-cell>
                <mat-cell *matCellDef="let element">
                <a routerLink="/collections/{{element.collection | slugify }}/forums/{{element.title | slugify }}/{{element.id}}"
                  [fragment]="element.collectionKey">{{element.title}}</a>  </mat-cell>
              </ng-container>
              <!-- status Column -->
              <ng-container matColumnDef="status">
                <mat-header-cell *matHeaderCellDef> Status </mat-header-cell>
                  <mat-cell *matCellDef="let element">
                      <ng-container  *ngIf="element.status !== 'Published' ">
                        <button mat-raised-button (click)="approve(element.id, 'Published')" color="warn">Click to Approve </button>
                     </ng-container>
                     <ng-container  *ngIf="element.status === 'Published'">
                        <button mat-raised-button  color="primary" (click)="approve(element.id, 'Unpublished')">Unapproved forum</button>
                     </ng-container>
                     <button mat-button color="warn" (click)="onDelete(element.id)">Delete Forum</button>
                  </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>
          </div>
     </div>
  </div>
</ng-template>
<ng-template #noforums>
    no forums to manage yet!
</ng-template>
  `,
  styleUrls: ['./../dashboard.component.css']
})
export class ForumsDashboard implements OnInit, OnDestroy {
  @Input() collection;
  displayedColumns = ['id', 'title', 'status'];
  ELEMENT_DATA = [];
  dataSource;
  data;
  forums;
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
       this.forums = this.store.select(fromStore.getAllForums);
        this.store.dispatch(  new forumActions.Query() );
        this.forums.subscribe(forumsAll => {
        this.data = forumsAll.filter((item) => {
          return item.collectionKey === collectionKey;
        });
          this.dataSource = new MatTableDataSource(this.data);
       });
   });

  }


  approve(id, status){
  if(status === 'Unpublished') {
      const con = confirm('Are you sure you want to unpublish this forum?')
    }
    this.forums.subscribe(forumsAll => {
      const forum = forumsAll.filter((item) => {
        return item.id === id;
      });
     if(forum) {
      const newForum = new Forum(forum[0].id, forum[0].title, forum[0].description, status,
         forum[0].collection, forum[0].component,
         forum[0].createdAt, forum[0].updatedAt, forum[0].collectionKey, forum[0].uid);
         this.store.dispatch( new forumActions.Update(id, newForum) );
     }
    });
  }

  onDelete(id) {
    if(confirm('Are you sure to delete thread?')){
     this._collections.getCommentCount(id, 'forumId', 'o-t-forum-replies').subscribe((comments) => {
       const commentCount =  comments.length;
       if(commentCount > 1){
         this._collections.deleteCollection('o-t-forum-replies', commentCount, id, 'forumId').subscribe((status) => {
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
       this.store.dispatch( new forumActions.Delete(id));
     }, 2000)
   }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
