import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject, Output, EventEmitter, Input} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { NotifyService } from '@shared/services/notify.service';
import { SpinnerService } from '@shared/services/spinner.service';


@Component({
  selector: 'app-wysiwyg',
  templateUrl: './wysiwyg.component.html',
  styleUrls: ['./wysiwyg.component.css']
})

export class WysiwygComponent implements OnInit, AfterViewInit{
  @Input() page: string;
  @ViewChild('richtextarea') richtextarea: ElementRef;
  @Output() publish = new EventEmitter<string>();
  @Output() draft = new EventEmitter<string>();
  img;
  disabled = false;
  draftspinner; publishspinner;
  notifyTXT: string;
  publishAbled: boolean = true;
  draftAbled: boolean = true;
  constructor(
    public dialog: MatDialog,
    public _spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.richtextarea.nativeElement.contentDocument.body.innerHTML = this.page;
  }

  ngAfterViewInit() {
    this.iFrameOn();
  }
  get textarea() {
    let page = this.richtextarea.nativeElement.contentDocument.body;
    page = page.innerHTML;
    return page;
  }

  isContent() {
    if (this.textarea.length > 150) {
      this.disabled = true;
      this.notifyTXT = '';
    } else {
      this.disabled = false;
      this.notifyTXT = 'Page Must Content Atleast 150 Characters';
    }
  }

  onPublish() {
    this._spinner.show('publishspinner');
    //this.draftAbled = !this.publishAbled;
    this.publish.next(this.textarea);
  }

  onDraft() {
    //this.publishAbled = !this.draftAbled;
    this._spinner.show('draftspinner');
    this.draft.next(this.textarea);
  }
  iFrameOn() {
    this.richtextarea.nativeElement.contentDocument.designMode = "On";
  }

  iBold() {
    this.richtextarea.nativeElement.contentDocument.execCommand('bold',  null, null);
  }

  iUnderline(){
    this.richtextarea.nativeElement.contentDocument.execCommand('underline', false, null);
  }

  iFontSize() {
    const dailogRef = this.dialog.open(DialogFont, {});

    dailogRef.afterClosed().subscribe( size => {
    if ( size) {
      this.richtextarea.nativeElement.contentDocument.execCommand('FontSize', false, size);
      }
    });
  }

  iForeColor(){
    const dailogRef = this.dialog.open(DialogColor, {});

    dailogRef.afterClosed().subscribe( color => {
    if ( color) {
       this.richtextarea.nativeElement.contentDocument.execCommand('ForeColor',false,color);
      }
    });
  }
  iHorizontalRule(){
    this.richtextarea.nativeElement.contentDocument.execCommand('inserthorizontalrule',false,null);
  }
  iItalic(){
    this.richtextarea.nativeElement.contentDocument.execCommand('italic',false,null);
  }
  iUnorderedList(){
    this.richtextarea.nativeElement.contentDocument.execCommand("InsertOrderedList", false,"newOL");
  }
  iOrderedList(){
    this.richtextarea.nativeElement.contentDocument.execCommand("InsertUnorderedList", false,"newUL");
  }
  iLink(){
    const dailogRef = this.dialog.open(DialogLink, {});

    dailogRef.afterClosed().subscribe( linkURL => {
    if ( linkURL ) {
      this.richtextarea.nativeElement.contentDocument.execCommand("CreateLink", false, linkURL);
      }
    });
  }
  iUnLink(){
    this.richtextarea.nativeElement.contentDocument.execCommand("Unlink", false, null);
  }
  enableObjectResizing(){
    this.richtextarea.nativeElement.contentDocument.execCommand("enableObjectResizing", false, null)
  }
  iheading(){

   const headingT = prompt("Enter title tag :", "H1, H2");
   this.richtextarea.nativeElement.contentDocument.execCommand("heading", false, headingT);
  }
  ijustifyCenter(){
    this.richtextarea.nativeElement.contentDocument.execCommand("justifyCenter", false, null)
  }
  istrikeThrough(){
    this.richtextarea.nativeElement.contentDocument.execCommand("strikeThrough", false, null)
  }
  iImage() {
    const dailogRef = this.dialog.open(DialogImg, {});
    dailogRef.afterClosed().subscribe(result => {
      this.img = result;
    if (this.img.length > 10) {
        this.richtextarea.nativeElement.contentDocument.execCommand('insertimage', false, this.img);
      }
    });
  }
}


@Component({
  selector: 'dialog-img',
  template:`
  <mat-card>
  <label class="custom-file mar-30 w-100">
  <input type="file"  id="inputFileToLoad" type="file" id="file" #file
  class="custom-file-input"
  accept=".jpg, .jpeg, .png, .gif"
  (change)="encodeImageFileAsURL($event)">
  <span class="custom-file-control"></span>
  </label>

  <button mat-raised-button color="primary"
   [disabled]="disabled" (click)="onClose()" class="w-100"><mat-icon>add</mat-icon> Click to Upload</button>
  </mat-card>
  `,
  styleUrls: ['./wysiwyg.component.css']

})
export class DialogImg {
  @ViewChild('file') file: ElementRef;
  selectedFiles: FileList | null;
  img;
  disabled: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<DialogImg>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

  }

  encodeImageFileAsURL($event) {
    this.selectedFiles = ($event.target as HTMLInputElement).files;
    const file = this.selectedFiles;
    if (file && file.length === 1) {
      this.disabled = false;
      const fileToLoad = file.item(0);
      const fileReader: FileReader = new FileReader();
      fileReader.onload = (e) => {
        const srcData = fileReader.result;
        this.img = srcData;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }

  onClose(): void {
    this.dialogRef.close(this.img);
  }

}

@Component({
  selector: 'dialog-font',
  template:`
  <mat-card class="w-25">
    <mat-select class="w-100" placeholder="Select Font Size" name="font" #fontNum
    ngModel (ngModelChange)="onClose(fontNum.value)">
      <mat-option *ngFor="let font of fonts"
          [value]="font.value" >{{font.font}}</mat-option>
    </mat-select>
  </mat-card>
  `,
  styleUrls: ['./wysiwyg.component.css']

})
export class DialogFont{
fonts = [
  {value: 7, font: 'Heading 1'},
  {value: 6, font: 'Heading 2'},
  {value: 5, font: 'Heading 3'},
  {value: 4, font: 'Heading 4'},
  {value: 3, font: 'Heading 5'},
  {value: 2, font: 'Heading 6'},
  {value: 1, font: 'Heading 7'}
];
font: number;
  constructor(
    public dialogRef: MatDialogRef<DialogFont>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

  }
  onClose(font): void {
    if(font) {
     this.dialogRef.close(font);
    }
  }

}

@Component({
  selector: 'dialog-color',
  template:`
  <mat-card class="w-25 nopadding">
  <div class="card-header"> Pick A Color</div>
  <div class="color-selector">
    <div class="selector" >
      <div
        class="color"
        *ngFor="let color of colors"
        [ngStyle]="{'background-color': color}"
        (click)="onClose(color)"
      >
      </div>
    </div>
  </div>
  <div class="clearfix"></div>
  </mat-card>
  `,
  styleUrls: ['./wysiwyg.component.css']

})
export class DialogColor {
colors: Array<string> = [
  '#378d3b', '#414141','#029ae4', '#778f9b', '#00887a', '#e53935', '#8c6d62',  '#f8a724',
  '#ff6f42', '#5b6abf', '#006064', '#ff4081', '#000000'
];
isSelectorVisible: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogColor>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

  }

  onClose(color): void {
    if(color) {
     this.dialogRef.close(color);
    }
  }

}

@Component({
  selector: 'dialog-link',
  template:`
  <mat-card class="w-100">
    <mat-form-field class="w-100">
      <input type="url" matInput [(ngModel)]="url" placeholder="Enter URl with http://:" (change)="onChange()">
    </mat-form-field>
    <button mat-raised-button color="primary" [disabled]="!url || !disabled"
      (click)="onClose(url)" class="w-100"><mat-icon>add</mat-icon> Click to add link</button>
  </mat-card>
  `,
  styleUrls: ['./wysiwyg.component.css']

})
export class DialogLink {
disabled: boolean = false;
url: string;
  constructor(
    public dialogRef: MatDialogRef<DialogLink>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notify: NotifyService

  ) {}

  onChange () {
    this.disabled = true;
  }

  onClose(link): void {
    if (link && (link.substring(0, 4) === 'http')) {
     this.dialogRef.close(link);
    } else {
      this.disabled = false;
      this._notify.update('<strong>Hmm! Bad Url!</strong> Change that URL.', 'error');
    }
  }

}



