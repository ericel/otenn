import { Component, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, Inject} from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SpinnerService } from '@shared/services/spinner.service';
import { CollectionComponents, Collection} from '@collections/state/models/collection.model';
import { UcFirstPipe } from 'ngx-pipes';
import { NgForm } from '@angular/forms';
import { NotifyService } from '@shared/services/notify.service';
import { Title, Meta } from '@angular/platform-browser';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { Upload } from '@shared/services/upload/upload.model';
import { UploadService } from '@shared/services/upload/upload.service';
import { SessionService } from '@shared/services/session.service';

import { Store, select } from '@ngrx/store';
import * as actions from '@collections/state/actions/collection.actions';
import * as fromStore from '@collections/state';
import { AuthService } from 'app/auth/state/auth.service';
@Component({
  selector: 'app-addcollection',
  templateUrl: './addcollection.component.html',
  styleUrls: ['./addcollection.component.css'],
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
export class AddcollectionComponent implements OnInit, OnDestroy {
  allow = false;
  changesSaved = false;
  sub: Subscription;
  title: string;
  description: string;
  status = 'Public Private'.split(' ');
  statusmodel = { options: 'Public' };
  itemsmodel: CollectionComponents = {pages: true, videos: false, photos: false, forums: false};
  collectionAdmins = ['494949393'];
  addspinner;
  color = '#fff';
  photoUrl= './assets/assets/favinco.png';
  changePhotoUrl = false;
  hideCollectionForm = true;
  notify_already = false;
  $key: string;
  collections;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;
  @ViewChild('descForm') descForm: NgForm;
  created$: Observable<boolean>
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
  ) {
    this.created$ = this.store.pipe(select(fromStore.getSuccessCollection));
  }

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

    this._route.fragment.subscribe((fragment: string) => {
      this.title = this._ucfirst.transform(fragment);
    });

    this.collections = this.store.select(fromStore.getAllCollections)
    this.store.dispatch(  new actions.Query() );
    this.collections = this.collections.subscribe((collections) => {
      this.collections = collections;
    });
  }


  private filterCheck() {
   return this.collections.filter(e =>  {
       return (e.title).toLowerCase() === this.title.toLowerCase();
   });
  }
  onAddCollection() {
    if (this.filterCheck().length > 0) {
      this.hideCollectionForm = false;
      this.changePhotoUrl = false;
      this.notify_already = true;
      return;
    }
    this.description = this.descForm.value.description;
    this._spinner.show('addspinner');
    this.$key = this._session.generate();
    if(this.color === '#fff') {this.color = '#029ae4'}
    const collection: Collection = new Collection(this.$key, this.title, this.description, this.photoUrl,
     this.statusmodel.options, this.itemsmodel, this._notify.getCurrentTime(),
      this._notify.getCurrentTime(), 'pages', this.collectionAdmins, this.color, this._auth.userId);
    if (this.description !== undefined && this.description.length > 100) {
        this.store.dispatch( new actions.Create(collection) )
        this.created$.subscribe((created) => {
        if(created) {
        setTimeout(() => {
          this.changesSaved = true;
          this.hideCollectionForm = false;
          this.changePhotoUrl = true;
        }, 2000);
       } else {
        this.changesSaved = false;
        this.hideCollectionForm = true;
        this.changePhotoUrl = false;
       }
      });
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

