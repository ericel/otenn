import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { VotingService } from '@services/voting/voting.service';
import { sum, values } from 'lodash';
import { AuthService } from '../../../auth/state/auth.service';
import { NotifyService } from '@shared/services/notify.service';
@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit, OnDestroy {

  @Input() condition;
  @Input() itemId;
  @Input() itemAuthId;
  voteCount = 0;
  userVote = 0;
  userVoteUp = 0;
  positiveVoteCounts= 0;
  negativeVoteCounts= 0;
  subscription;
  subscription2;
  votePathUp;
  votePathDown;
  constructor(
    private upvoteService: VotingService,
    private _auth: AuthService,
    private _notify: NotifyService
  ) { }
  ngOnInit() {

    this.subscription = this.upvoteService.getItemVotesUp(this.condition, this.itemId)
                      .subscribe(upvotes => {
                        if(upvotes){
                            this.userVoteUp = upvotes[this._auth.userId]
                            this.positiveVoteCounts = sum(values(upvotes))
                          }
                      });
    this.subscription2 = this.upvoteService.getItemVotesDown(this.condition, this.itemId)
                      .subscribe(downvotes => {
                        if(downvotes) {
                            this.userVote = downvotes[this._auth.userId]
                            this.negativeVoteCounts = sum(values(downvotes))
                  }
    })

  }
  upvote() {
    if(!this._auth.userId) {
      this._notify.update('<strong>Oops!</strong> Please you need to log in', 'error' );
      return;
    }
    if(this._auth.userId === this.itemAuthId){
      this._notify.update('<strong>Oops!</strong> You can\'t upvote yourself', 'error' );
      return;
    }
    const vote = this.userVoteUp === 1 ? 0 : 1
    const action = 'upvote'
    this.upvoteService.updateUserVote(this.itemId, this._auth.userId, vote, action, this.condition)
  }
  downvote() {
    if(!this._auth.userId) {
      this._notify.update('<strong>Oops!</strong> Please you need to log in', 'error' );
      return;
    }
    if(this._auth.userId === this.itemAuthId){
      this._notify.update('<strong>Oops!</strong> You can\'t downvote yourself', 'error' );
      return;
    }
    const vote = this.userVote === -1 ? 0 : -1
    const action = 'downvote'
    this.upvoteService.updateUserVote(this.itemId, this._auth.userId, vote, action, this.condition)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

}
