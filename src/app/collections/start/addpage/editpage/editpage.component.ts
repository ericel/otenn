import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SpinnerService } from '@shared/services/spinner.service';
import { Page } from '@collections/state/page.model';
import { UcFirstPipe } from 'ngx-pipes';
import { NgForm, FormControl} from '@angular/forms';
import { NotifyService } from '@shared/services/notify.service';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { CollectionsService } from '@collections/state/collections.service';
import { Upload } from '@shared/services/upload/upload.model';
import { Title, Meta } from '@angular/platform-browser';
import { SessionService } from '@shared/services/session.service';
import { UploadService } from '@shared/services/upload/upload.service';
import { Collection } from '@collections/state/collections.model';
@Component({
  selector: 'app-editpage',
  templateUrl: './editpage.component.html',
  styleUrls: ['./editpage.component.css', './../addpage.component.css'],
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
export class EditpageComponent implements OnInit, OnDestroy {
  allow = false;
  changesSaved = false;
  sub: Subscription;
  section: string;
  description: string;
  title: string;
  collections;
  submitted: boolean = false; addImg: boolean = false;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;
  photoUrl: string = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  $key: string;
  component: string = 'pages'; status;
  page; createdAt; collectionkey;
  colkey;
  @ViewChild('pageForm') pageForm: NgForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _spinner: SpinnerService,
    private _ucfirst: UcFirstPipe,
    private _notify: NotifyService,
    private _collections: CollectionsService,
    private _title: Title,
    private _meta: Meta,
    public _session: SessionService,
    private _upload: UploadService
  ) { }

  ngOnInit() {
  this._title.setTitle('Edit page');
  this._meta.addTags([
    { name: 'keywords', content: 'Edit an Otenn page'},
    { name: 'description', content: 'Edit an Otenn page' }
  ]);

   this.sub = this._route.queryParams
    .subscribe(
      (queryParams: Params) => {
        this.$key = queryParams['key'];
        this._route.fragment
        .subscribe(
          (fragment: string) => {
            this._collections.getCollection(fragment).subscribe(
            (collection: Collection) => {
              this._collections.getPage(collection.title, this.component, this.$key).subscribe(
                (page: Page) => {
                  this.colkey = fragment;
                  this.title = page.title;
                  this.section = collection.title;
                  this.description = page.description;
                  this.page = page.page;
                  this.createdAt = page.createdAt;
                  this.photoUrl = page.photoURL;
                  this.collectionkey = page.collectionKey;
                  this.status = page.status;
                });
            });
          });
      } );

  }
  get collectValue () { return this.pageForm.form.get('collection')}
  get descriptionValue () { return this.pageForm.form.get('description')}
  get titleValue () { return this.pageForm.form.get('title')}

  onDraft(page: string) {
    if (this.pageForm.form.status === 'VALID') {
      const newPage = new Page(this.$key, this.titleValue.value, this.descriptionValue.value, page, this.photoUrl, 'Draft',
         this.collectValue.value, this.component,
        this.createdAt, this._session.getCurrentTime(), this.collectionkey, 'uid');
    this._collections.updateDraft(newPage).then((status: string) => {
        if (status === 'error') {
          this.changesSaved = false;
          this.submitted = false;
          this.addImg = false;
        } else {
          this.changesSaved = true;
          setTimeout(() => {
            this.submitted = true;
            this.addImg = true;
          }, 3000);
        }
    });
    } else {
      if ((this.collectValue.value).length < 5) {this._notify.update(
        '<strong>Page Collection Error:</strong> Please select a collection',
      'error'); this._spinner.hideAll() }
      if ((this.titleValue.value).length < 50) {this._notify.update(
        '<strong>Page Title Error:</strong> Title must be between 50 to 150 characters',
      'error'); this._spinner.hideAll() }
    }
  }

  onPublish(page: string) {
    this.description = this.descriptionValue.value;
    this.title = this.titleValue.value;
    if (this.pageForm.form.status === 'VALID') {
      if(this.status === 'Approved'){
         this.status = this.status;
      } else {
        this.status = 'On queue waiting..collection admin';
      }
      const newPage = new Page(this.$key, this.titleValue.value, this.descriptionValue.value, page, this.photoUrl,
      this.status, this.collectValue.value, this.component,
        this.createdAt, this._session.getCurrentTime(), this.collectionkey, 'uid');
        this._collections.updatePage(newPage).then((status: string) => {
        if (status === 'error') {
          this.changesSaved = false;
          this.submitted = false;
          this.addImg = false;
        } else {
          this.changesSaved = true;
          setTimeout(() => {
            this.submitted = true;
            this.addImg = true;
          }, 3000);
        }
    });
    } else {
      if ((this.collectValue.value).length < 5) {this._notify.update(
        '<strong>Page Collection Error:</strong> Please select a collection',
      'error'); this._spinner.hideAll() }

      if ((this.titleValue.value).length < 50) {this._notify.update(
        '<strong>Page Title Error:</strong> Title must be between 50 to 150 characters',
      'error'); this._spinner.hideAll() }

      if ((this.descriptionValue.value).length < 70) {this._notify.update(
        '<strong>Page Title Error:</strong> Page Description must be between 70 to 150 characters',
      'error'); this._spinner.hideAll() }
    }
  }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.currentUpload = new Upload(file.item(0));
      const path = `${this.section}/${this.component}/${this.$key}`;
      const firestoreUrl = `${this.section}/${this.component}/${this.component}/${this.$key}`;
      this._upload.pushUpload('uid', this.currentUpload, this.$key, path, firestoreUrl);
      this._collections.getPage(this.section, this.component, this.$key)
      .subscribe( (page) => {
         this.photoUrl = page.photoURL;
      });
    } else {
      this._notify.update('<strong>No file found!</strong> upload again.', 'error')
    }
   }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allow) {
      return true;
    }
   if (!this.changesSaved) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
