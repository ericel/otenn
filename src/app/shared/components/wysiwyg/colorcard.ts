import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-colorcard',
  template: `
  <div class="color-selector-1">
      <i (click)="showSelector(true)" class="fa fa-tachometer fa-2x" aria-hidden="true"></i>
      <div class="selector row center-xs" *ngIf="isSelectorVisible">
        <div
          class="color"
          *ngFor="let color of colors"
          [ngStyle]="{'background-color': color}"
          (click)="selectColor(color)"
        >
        </div>
      </div>
    </div>
  `,
  styles: [`
 .color-selector-1 {
      position: relative;
    }
    .selector {
      min-width: 150px;
      border: 1px solid lightgrey;
      padding: 10px;
      background-color: #efefef;
      background-color: rgba(68, 82, 111, 0.61);
      position: absolute;
      top: 50px;
      left: 0;
      border-radius: 4px;
      /*transform: rotate(-20deg);*/
      z-index: 99;
    }

    .color {
      height: 30px;
      width: 30px;
      border-radius: 100%;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .color:hover {
      border: 2px solid darkgrey;
    }
    i {
      font-size: 1.4rem;
      color: grey;
      cursor: pointer;
      color: rgb(255, 64, 129) !important;
    }
  `]
})
export class ColorCard implements OnInit {
 @Output() selected = new EventEmitter<string>();
 colors: Array<string> = [
  '#378d3b', '#414141','#029ae4', '#778f9b', '#00887a', '#e53935', '#8c6d62',  '#f8a724',
  '#ff6f42', '#5b6abf', '#006064', '#ff4081'
];
 isSelectorVisible: boolean = false;
 isAuthorized: boolean = false;
 user;
 statusShow: boolean = false;
  constructor() { }

  ngOnInit() {

  }

  toggleStatus() {
     this.statusShow = true;
  }



  showSelector(value: boolean) {
    this.isSelectorVisible = value;
  }

  selectColor(color: string) {
    this.showSelector(false);
    this.selected.next(color);
  }
}
