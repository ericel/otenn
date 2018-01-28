import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {trigger, transition, style, animate, state} from '@angular/animations';
import { CollectionsService } from '@collections/state/collections.service';
import { FormControl, FormGroup, Validators, FormBuilder, NgForm} from '@angular/forms';
import { UcFirstPipe } from 'ngx-pipes';
import { SpinnerService } from '@shared/services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifyService } from '@shared/services/notify.service';
import { Collection } from '@collections/state/collections.model';
import { Title, Meta } from '@angular/platform-browser';

type UserFields = 'collectionName';
type FormErrors = { [u in UserFields]: string };
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
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
export class StartComponent implements OnInit {
indicator: boolean = false;
startIntro: boolean = true;
startCollect: boolean = false;
startPage: boolean = false;

startCollectF: FormGroup;
@ViewChild('pageForm') pageForm: NgForm;

collections;
collectionName: string = '';
formErrors: FormErrors = {
  'collectionName': ''
};
validationMessages = {
  'collectionName': {
    'required': 'Collection Name is required.',
    'minlength': 'Collection must be at least 5 characters long.',
    'maxlength': 'Collection cannot be more than 20 characters long.',
    'nameIsForbidden': 'This Collection Already Exist!',
    'whitespace': 'No Whitespace for name!'
  }
};
  constructor(
    public _fb: FormBuilder,
    private _collections: CollectionsService,
    private _ucfirst: UcFirstPipe,
    private _spinner: SpinnerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _notify: NotifyService,
    private _title: Title,
    private _meta: Meta
  ) { }

  ngOnInit() {
    this._title.setTitle('Start A Collection Today');
    this._meta.addTags([
      { name: 'keywords', content: 'Start A Collection Today, blogs, forums, community page'},
      { name: 'description', content: 'Start your own collection. It could be a blog, forum or community page!' }
    ]);

    this._collections.getAllCollections().subscribe(
      (collections) => {
        this.collections = collections;
      });
    this.buildstartCollectFForm();
  }



  buildstartCollectFForm(){
    this.startCollectF = this._fb.group({
      'collectionName': [null, [Validators.required, this.forbiddenNames.bind(this),
        Validators.minLength(5), Validators.maxLength(20), this.noWhitespaceValidator]
      ]
    });
    this.startCollectF.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.startCollectF) { return; }
    const form = this.startCollectF;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'collectionName')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }

  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (control.value) {
      const value = (control.value).toLowerCase();
    if (this.collections) {
      if (this.collections.filter(e => (e.title).toLowerCase() ===
        value)
        .length > 0) {
        return {'nameIsForbidden': true};
      }
    }
  }
    return null;
  }


  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
 }

  onCollections() {
    this.indicator = !this.indicator;
    setTimeout(() => {
      this.indicator = false;
      this.startIntro = false;
      this.startPage = false;
      this.startCollect = true;
     }, 3000);
  }

  onPage() {
    this.indicator = !this.indicator;
    setTimeout(() => {
      this.indicator = false;
      this.startIntro = false;
      this.startCollect = false;
      this.startPage = true;
     }, 3000);
  }

  onSubmitPage() {
    this._spinner.show('pageSpinner');
    setTimeout(() => {
       this._spinner.hideAll();
       this._router.navigate(['/collections/addpage'], { queryParams: { allow: 1, collectionkey: this.pageForm.value.key },
        fragment: this.pageForm.value.category });
    }, 2000);
  }
  onSubmit() {
     this._spinner.show('showSpinner');
     this._collections.getCollection(this.startCollectF.value.collectionName).subscribe(
      (collection: Collection) => {
         if (collection) {
            if (this.startCollectF.value.collectionName === collection.title){
              this._notify.update('<strong>This Collection Already Exist</strong>', 'error');
              this._router.navigate(['/collections/start']);
            }
         }
     });
     setTimeout(() => {
        this._spinner.hideAll();
        this._router.navigate(['/collections/addcollection'], { queryParams: { allow: 1 },
         fragment: this.startCollectF.value.collectionName });
     }, 2000);
  }
}
