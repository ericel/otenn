import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { CollectionsService } from "@collections/state/collections.service";
import { sum, values } from 'lodash';
import { AuthService } from "../../../../auth/state/auth.service";
import { NotifyService } from "@shared/services/notify.service";
@Component({
   selector: 'vote-replies',
   template:`
   <div class="votebox">
   <span class="fa fa-arrow-up vote up"
         (click)="upvote()"
         [ngClass]="{'active' : userVote > 0 }">
   </span>
   <span class="vote-count">{{voteCount}}</span>

   <span class="fa fa-arrow-down vote down"
         (click)="downvote()"
         [ngClass]="{'active' : userVote < 0 }">

   </span>
 </div>
   `,
   styles: [`
   .votebox {
    height: 50px;
    width: 50px;
    display: flex;
    text-align: center;
    flex-direction: column;
    font-size: 1.2em;
  }
    .vote, .vote:hover {
      cursor: pointer;
    }
    .vote:hover {
      color: orange;
    }
    .active.up {
        color: green;
      }

    .active.down {
       color: red;
     }

     @media screen and (max-width: 700px) {
      .votebox {
        display: inline-block;
        text-align: center;
        font-size: 1em;
      }
     }
   `]
})

export class VoteReplies implements OnInit, OnDestroy {
  @Input() replyAuthId;
  @Input() replyId;

  voteCount = 0;
  userVote = 0;
  sub: Subscription;
  constructor(
    private _collections: CollectionsService,
    public _auth: AuthService,
    private _notify: NotifyService
  ){}

  ngOnInit () {
     this.sub =  this._collections.getItemVotes(this.replyId)
     .subscribe(upvotes => {
       if (upvotes) {
        this.userVote = upvotes[this._auth.userId]
        this.voteCount = sum(values(upvotes))
      }
     })
  }

  upvote() {
    if(!this._auth.userId) {
      this._notify.update('<strong>Oops!</strong> Please you need to log in', 'error' );
      return;
   }
    if(this._auth.userId === this.replyAuthId) {
       this._notify.update('<strong>Oops!</strong> You can\'t upvote your own answer', 'error' );
       return;
    }
    const vote = this.userVote == 1 ? 0 : 1
    this._collections.updateUserVote(this.replyId, this._auth.userId, vote)
  }

  downvote() {
    if(!this._auth.userId) {
      this._notify.update('<strong>Oops!</strong> Please you need to log in', 'error' );
      return;
   }
    if(this._auth.userId === this.replyAuthId) {
      this._notify.update('<strong>Oops!</strong> You can\'t downvote your own answer', 'error' );
      return;
   }
    const vote = this.userVote == -1 ? 0 : -1
    this._collections.updateUserVote(this.replyId, this._auth.userId, vote)
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
