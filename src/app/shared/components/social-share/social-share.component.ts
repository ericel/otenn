import { Component, OnInit, Input } from '@angular/core';
import { SlugifyPipe } from 'ngx-pipes';
import { Http } from '@angular/http';
@Component({
  selector: 'app-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.css'],
  providers: [SlugifyPipe]
})
export class ShareComponent implements OnInit {
 @Input() content;
 fbCount: number;
 twCount: number;
 goCount: number;
  constructor(
    private _slugify: SlugifyPipe,
    private _http: Http
  ) { }

  ngOnInit() {
    this.facebookcount ();
    this.twittercount ();
    this.googlecount ();
  }

  facebook() {
    console.log('facbook')
  }
  private facebookcount () {
    const jsonUrl = 'https://graph.facebook.com/?id=' + this.url;
    return  this._http.get(jsonUrl)
      .map(res => res.json())
      .subscribe(facebook => this.fbCount =  facebook.share.share_count);
  }
  private twittercount () {
    const jsonUrl = 'https://opensharecount.com/count.json?url=' + 'http://www.bbc.co.uk/programmes/b039ctgc';
    return  this._http.get(jsonUrl)
      .map(res => res.json())
      .subscribe(twitter => this.twCount =  twitter.count);
  }
  private googlecount () {
    const jsonUrl = 'https://clients6.google.com/rpc';
    const body = [{
      "method":"pos.plusones.get",
      "id": this.url,
      "params":{
        "nolog":true,
        "id": this.url,
        "source":"widget",
        "userId":"@viewer",
        "groupId":"@self"
        },
      "jsonrpc":"2.0",
      "key":"p",
      "apiVersion":"v1"
    }];
    this._http.post(jsonUrl, body).map( res => res.json())
    .subscribe(google => this.goCount = google[0].result.metadata.globalCounts.count);
  }
  twitter() {
    console.log('twitter')
  }

  google() {
    console.log('mail')
  }

  rating() {
    console.log('rating')
  }

  comments() {
    console.log('comments')
  }
  get id() {
    return this.content.id;
  }
  get title() {
    return this.content.title;
  }

  get description() {
    return this.content.description;
  }
 get collection () {
   return this.content.collection;
 }

 get component () {
   return this.content.component;
 }

 get collectionkey () {
   return this.content.collectionKey;
 }

 get url() {
    let component = this._slugify.transform(this.component) + '/';
    let collection = this._slugify.transform(this.collection) + '/';
    let id = this.id;
    let collectionkey = this.collectionkey;
    if( this.component === undefined){
       component = '';
       collection = '';
       id = '';
       collectionkey = this.id;
    }
    return 'https://otenn-85c21.firebaseapp.com' + '/collections/c/'
    + collection +  component  + this._slugify.transform(this.title) + '/' + id + '#' + collectionkey;
  }
}
