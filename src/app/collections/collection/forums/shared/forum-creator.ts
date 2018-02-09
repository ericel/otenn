import { Component, OnInit } from "@angular/core";


@Component ({
  selector: 'forum-creator',
  template:`
  <mat-card class="w-100 host">
   <div class="user-stable">
      <img src="./../../../../../assets/img/avatar.png" class="img-thumbnail user-img">
      <span class="auth">As Oj Obasi</span>
   </div>
    <mat-form-field class="w-100">
      <input matInput placeholder="Your Question">
    </mat-form-field>
    <mat-form-field class="w-100" >
      <textarea matInput placeholder="More details on your question"></textarea>
    </mat-form-field>
    <button mat-raised-button color="primary" class="float-right">
           Add Thread
    </button>
    <div class="clearfix"></div>
  </mat-card>
  `,
  styles: [`
  .host {

  }
  .user-img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    float: left;
  }
  .auth {
    line-height: 5;
    padding-top: 10px;
    margin-left: 5px;
  }
  textarea {
    min-height: 200px;
  }
  `]
})
export class ForumCreator implements OnInit {
  constructor() {}

  ngOnInit () {
    //dd
  }
}
