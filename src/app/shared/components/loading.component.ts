import { Component, Input } from "@angular/core";

@Component ({
  selector: 'loading',
  template: `<main class="main" *ngIf='!load'>
  <div class="container-fluid text-center justify-vertically-loading">
    <ng-container ><i class="fa fa-spinner fa-spin fa-4x text-muted" aria-hidden="true"></i></ng-container>
  </div>
</main>`,
  styles: [`
  .justify-vertically-loading {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    margin: 20px auto;
  }
  `]
})
export class LoadingComponent {
  @Input() load: boolean;
  constructor(){}
}

@Component ({
  selector: 'loading-comments',
  template: `<main class="main" *ngIf='!load'>
  <div class="container-fluid text-center justify-vertically-loading">
    <ng-container ><i class="fa fa-ellipsis-h fa-spin fa-4x text-muted" aria-hidden="true"></i></ng-container>
  </div>
</main>`,
  styles: [`
  .justify-vertically-loading {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    margin: 20px auto;
  }
  `]
})
export class LoadingCommentsComponent {
  @Input() load: boolean;
  constructor(){}
}


export const LOADERS_COM = [
  LoadingComponent,
  LoadingCommentsComponent
]
