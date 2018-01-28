import { Component, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, Inject} from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SpinnerService } from '@shared/services/spinner.service';
import { CollectionItems, Collection} from '@collections/state/collections.model';
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
  title: string;
  description: string;
  status = 'Public Private'.split(' ');
  statusmodel = { options: 'Public' };
  itemsmodel: CollectionItems = {pages: true, videos: false, photos: false, forums: false};
  collectionAdmins = ['494949393'];
  addspinner;
  collection;
  color: string = '#fff';
  photoUrl: string;
  changePhotoUrl: boolean = false;
  hideCollectionForm: boolean = true;
  notify_already: boolean = false;
  $key: string;
  collections;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;

  @ViewChild('descForm') descForm: NgForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _spinner: SpinnerService,
    private _ucfirst: UcFirstPipe,
    private _notify: NotifyService,
    private _collections: CollectionsService,
    private _title: Title,
    private _meta: Meta,
    public dialog: MatDialog,
    public _upload: UploadService,
    private _session: SessionService
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

    this._route.params
    .subscribe(
      (params: Params) => {
        this.title = params['string'];
      }
    );

    this._collections.getAllCollections().subscribe(
      (collections) => {
        this.collections = collections;
      });


    this._route.fragment.subscribe((fragment: string) => {
      this.$key = this._ucfirst.transform(fragment);
      this._collections.getCollection(this.$key).subscribe(
      (collection: Collection) => {
         this.collection = collection;
         this.itemsmodel = this.collection.items;
         this.statusmodel = {options: this.collection.status};
         this.photoUrl = this.collection.photoURL;
         this.color = this.collection.color;
      });
    });

  }

  private filterCheck() {
   return this.collections.filter(e =>  {
       return (e.title).toLowerCase() === this.title.toLowerCase();
   });
  }
  onAddCollection() {
    if (this.filterCheck().length < 0) {
      return;
    }
    this.description = this.descForm.value.description;
    this._spinner.show('addspinner');
    if(this.color === '#fff') {this.color = '#029ae4'}
    const collection: Collection = new Collection(this.$key, this.title, this.description, this.photoUrl,
     this.statusmodel.options, this.itemsmodel, this._notify.getCurrentTime(),
      this._notify.getCurrentTime(), this.collectionAdmins, this.color, 'uid');
    if (this.description !== undefined && this.description.length > 100) {
        this.changesSaved = true;
        this._collections.editcollection(collection);
        this.getCollectionPhoto();
        setTimeout(() => {
          this.hideCollectionForm = false;
          this.changePhotoUrl = true;
        }, 2000);
    } else {
      this._notify.update("<strong>Description Needed!</strong> Atleast 100 Character long.", "error")
      this._spinner.hideAll();
    }

  }

 private getCollectionPhoto() {
    this._collections.getCollection(this.$key).subscribe(
      (collection: Collection) => {
         if (collection) {
            this.photoUrl = collection.photoURL;
         }
     });
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
      const path = 'collections';
      const firestoreUrl = `o-t-collections/${this.$key}`;
      this._upload.pushUpload('uid', this.currentUpload, name, path, firestoreUrl);
    } else {
      this._notify.update("<strong>No file found!</strong> upload again.", 'error')
    }
   }

  //get debug() { return JSON.stringify(this.statusmodel); }
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
