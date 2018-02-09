import { Component, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, Inject} from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SpinnerService } from '@shared/services/spinner.service';
import { CollectionComponents, Collection} from '@collections/state/models/collection.model';
import { UcFirstPipe } from 'ngx-pipes';
import { NgForm } from '@angular/forms';
import { NotifyService } from '@shared/services/notify.service';
import { CollectionsService } from '@collections/state/collections.service';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { Upload } from '@shared/services/upload/upload.model';
import { UploadService } from '@shared/services/upload/upload.service';
import { SessionService } from '@shared/services/session.service';


import { Store } from '@ngrx/store';
import * as actions from '@collections/state/actions/collection.actions';
import * as fromStore from '@collections/state';
import { AuthService } from 'app/auth/state/auth.service';
@Component({
  selector: 'app-editcollection',
  templateUrl: './editcollection.component.html',
  styleUrls: ['./../addcollection.component.css'],
  providers: [UcFirstPipe],
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
export class EditcollectionComponent implements OnInit, OnDestroy {
  allow = false;
  changesSaved = false;
  sub: Subscription;
  title: string; description: string;
  status = 'Public Private'.split(' ');
  statusmodel = { options: 'Public' };
  itemsmodel = {pages: true, videos: false, photos: false, forums: false};
  components = ['pages', 'forums', 'videos', 'photos']
  collectionAdmins = ['494949393'];
  addspinner;
  collection;
  color = '#fff';
  photoUrl: string;
  changePhotoUrl = false;
  hideCollectionForm = true;
  notify_already = false;
  $key: string;
  collections;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;
  homepage;
  @ViewChild('descForm') descForm: NgForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _spinner: SpinnerService,
    private _ucfirst: UcFirstPipe,
    private _notify: NotifyService,
    private _title: Title,
    private _meta: Meta,
    public dialog: MatDialog,
    public _upload: UploadService,
    private _session: SessionService,
    private store: Store<fromStore.State>,
    public _auth: AuthService
  ) { }

  ngOnInit() {
  this._title.setTitle('Create A Collection');
  this._meta.addTags([
    { name: 'keywords', content: 'Create an Otenn Collection'},
    { name: 'description', content: 'Create an Otenn Collection' }
  ]);

   this.sub = this._route.queryParams
    .subscribe(
      (queryParams: Params) => {
        this.allow = queryParams['allow'] === '1' ? true : false;
      }
    );

      this.sub = this._route.fragment.subscribe(
        (collectionKey: string) => {
         this.collections = this.store.select(fromStore.getAllCollections);
          this.store.dispatch(  new actions.Query() );
          this.collections.subscribe(data => {
            this.collection =  data.filter((item) => {
               return item.id === collectionKey;
             });
            this.collection = this.collection[0];
            if(this.collection) {
              this.title = this.collection.title;
              this.$key = collectionKey;
              this.itemsmodel = this.collection.components;
              this.statusmodel = {options: this.collection.status};
              this.photoUrl = this.collection.photoURL;
              this.color = this.collection.color;
              this.homepage = this.collection.homepage || 'pages';
            }
           });
     });
  }


  onAddCollection() {
    this.description = this.descForm.value.description;
    this._spinner.show('addspinner');
    if(this.color === '#fff') {this.color = '#029ae4'}

    if (this.itemsmodel[this.homepage]) {
      this.homepage = this.homepage;
    } else {
      this.homepage = 'pages';
    }
    const collection: Collection = new Collection(this.$key, this.title, this.description, this.photoUrl,
     this.statusmodel.options, this.itemsmodel, this._notify.getCurrentTime(),
      this._notify.getCurrentTime(), this.homepage, this.collectionAdmins, this.color, this._auth.userId);
    if (this.description !== undefined && this.description.length > 100) {
        this.changesSaved = true;
        this.store.dispatch( new actions.Update(this.$key, collection) );
        setTimeout(() => {
          this.hideCollectionForm = false;
          this.changePhotoUrl = true;
        }, 2000);
    } else {
      this._notify.update('<strong>Description Needed!</strong> Atleast 100 Character long.', 'error')
      this._spinner.hideAll();
    }

  }

  onColorSelect(color: string) {
    this.color = color;
  }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.currentUpload = new Upload(file.item(0));
      const name = this.title;
      const path = `collections/${this.$key}`;
      const firestoreUrl = `o-t-collections/${this.$key}`;
      this._upload.pushUpload(this._auth.userId, this.currentUpload, name, path, firestoreUrl);
    } else {
      this._notify.update('<strong>No file found!</strong> upload again.', 'error')
    }
   }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allow) {
      return true;
    }
    if ((this.itemsmodel !== this.itemsmodel || this.statusmodel.options !== this.statusmodel.options) && !this.changesSaved &&
     (this.description !== this.description) ) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
