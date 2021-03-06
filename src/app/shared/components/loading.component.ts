import { Component, Input } from "@angular/core";

@Component ({
  selector: 'loading',
  template: `<main *ngIf='!load'>
  <div class=" text-center justify-vertically-loading">
    <ng-container ><i class="fas fa-spinner fa-pulse fa-4x text-muted" aria-hidden="true"></i></ng-container>
  </div>
</main>`,
  styles: [`
  .justify-vertically-loading {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    top: 0px;
    margin: 0 auto;
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
    <ng-container ><i class="fas fa-spinner fa-pulse"></i></ng-container>
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
