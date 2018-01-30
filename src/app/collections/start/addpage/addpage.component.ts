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
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.css'],
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
export class AddpageComponent implements OnInit, OnDestroy {
  allow = false;
  changesSaved = false;
  sub: Subscription;
  section: string;
  collectionKey;
  description: string;
  title: string;
  collections;
  submitted: boolean = false; addImg: boolean = false;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;
  photoUrl: string = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  $key: string;
  component: string = 'pages';
  page = 'Please write your page here!';
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
  this._title.setTitle('Write a page');
  this._meta.addTags([
    { name: 'keywords', content: 'Create an Otenn page'},
    { name: 'description', content: 'Create an Otenn page' }
  ]);

  this.collections = this._collections.collections;
   this.sub = this._route.queryParams
    .subscribe(
      (queryParams: Params) => {
        this.allow = queryParams['allow'] === '1' ? true : false;
      }
    );

    this.sub = this._route.fragment
    .subscribe(
      (fragment: string) => {
        this._collections.getCollection(fragment)
        .subscribe((collection: Collection) => {
          this.section = collection.title;
          this.collectionKey = collection.$key;
          this.description = '';
        })
      }
    );
  }
  get collectValue () { return this.pageForm.form.get('collection')}
  get descriptionValue () { return this.pageForm.form.get('description')}
  get titleValue () { return this.pageForm.form.get('title')}

  onDraft(page: string) {
    this.description = this.descriptionValue.value;
    this.title = this.titleValue.value;
    if (this.pageForm.form.status === 'VALID') {
      this.$key = this._session.generate();
      const newPage = new Page(this.$key, this.titleValue.value, this.descriptionValue.value, page, this.photoUrl,
      'Draft', this.collectValue.value, this.component,
        this._session.getCurrentTime(), this._session.getCurrentTime(), this.collectionKey, 'uid');
     this._collections.addDraft(newPage).then((status: string) => {
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
      this.$key = this._session.generate();
      const newPage = new Page(this.$key, this.titleValue.value, this.descriptionValue.value, page, this.photoUrl,
      'On queue waiting..collection admin', this.collectValue.value, this.component,
        this._session.getCurrentTime(), this._session.getCurrentTime(), this.collectionKey, 'uid');
      this._collections.addPage(newPage).then((status: string) => {
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
      const name = this.$key;
      const path = `${this.section}/${this.component}/${name}`;
      const firestoreUrl = `${this.section}/${this.component}/${this.component}/${name}`;
      this._upload.pushUpload('uid', this.currentUpload, name, path, firestoreUrl);
    this._collections.getPage(this.section, this.component, this.$key)
      .subscribe( (page) => {
        if(page){
          this.photoUrl = page.photoURL;
        }

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
