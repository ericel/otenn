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
  collections;
  submitted: boolean = false; addImg: boolean = false;
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  currentUpload: Upload;
  collectionImg: string = 'https://www.w3schools.com/bootstrap4/paris.jpg';
  @ViewChild('pageForm') pageForm: NgForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _spinner: SpinnerService,
    private _ucfirst: UcFirstPipe,
    private _notify: NotifyService,
    private _collections: CollectionsService,
  ) { }

  ngOnInit() {
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
         this.section = this._ucfirst.transform(fragment);
      }
    );
  }
  get collectValue () { return this.pageForm.form.get('collection')}
  get titleValue () { return this.pageForm.form.get('title')}
  onDraft(page: string) {

    if (this.pageForm.form.status === 'VALID') {
      const newPage = new Page(this.titleValue.value, page, 'photourl', 'status', this.collectValue.value, 'createdAt', 'updatedAt', 'uid');
      this._collections.addDraft(newPage);
      this.changesSaved = true;
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
    if (this.pageForm.form.status === 'VALID') {
      const newPage = new Page(this.titleValue.value, page, 'photourl', 'status', this.collectValue.value, 'createdAt', 'updatedAt', 'uid');
      this._collections.addPage(newPage);
      this.changesSaved = true;
      setTimeout(() => {
        this.submitted = true;
        this.addImg = true;
      }, 3000);
    } else {
      if ((this.collectValue.value).length < 5) {this._notify.update(
        '<strong>Page Collection Error:</strong> Please select a collection',
      'error'); this._spinner.hideAll() }

      if ((this.titleValue.value).length < 50) {this._notify.update(
        '<strong>Page Title Error:</strong> Title must be between 50 to 150 characters',
      'error'); this._spinner.hideAll() }
    }
  }

  detectFiles($event: Event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.currentUpload = new Upload(file.item(0));
      console.log(this.currentUpload)
      this.collectionImg = this.currentUpload.file.name;
     // this._upload.pushUpload(this.data.uid, this.currentUpload);
    } else {
      this._notify.update("<strong>No file found!</strong> upload again.", 'error')
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
