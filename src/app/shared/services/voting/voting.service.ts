import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { merge } from 'rxjs/observable/merge';
import { NotifyService } from '@shared/services/notify.service';
@Injectable()
export class VotingService {
votePathUp;
votePathDown;
  constructor(private afs: AngularFirestore,
   private notify: NotifyService
  ) { }

  getItemVotesUp(condition: string, itemId): Observable<any> {
    if(condition = 'page') {
     this.votePathUp = `o-t-pages-comments-upvotes`;
    }
    // Gets total votes
    const ref =  this.afs.doc(`${this.votePathUp}/${itemId}`);
    return ref.valueChanges();
  }
  getItemVotesDown(condition: string, itemId): Observable<any> {
    if(condition = 'page') {
      this.votePathDown = `o-t-pages-comments-downvotes`;
     }
    const ref =  this.afs.doc(`${this.votePathDown}/${itemId}`);
    return ref.valueChanges();
  }
  updateUserVote(itemId, userId, vote, action, condition): void {
    if(action === "upvote"){
       this.upVote(vote, userId, condition, itemId);
       this.downVote(0, userId, condition, itemId);
    }

    if(action === "downvote"){
      this.downVote(vote, userId, condition, itemId);
      this.upVote(0, userId, condition, itemId);
    }

  }
  private downVote(vote, userId, condition, itemId){
    if(condition = 'page') {
      this.votePathDown = `o-t-pages-comments-downvotes`;
     }
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${this.votePathDown}/${itemId}`);
        const data = {};
        data[userId] = vote;
       userRef.set(data, {merge:true});
  }
  private upVote(vote, userId, condition, itemId){
    if(condition = 'page') {
      this.votePathUp = `o-t-pages-comments-upvotes`;
     }
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`${this.votePathUp}/${itemId}`);
        const data = {};
        data[userId] = vote;
       userRef.set(data, {merge:true});
  }
}
