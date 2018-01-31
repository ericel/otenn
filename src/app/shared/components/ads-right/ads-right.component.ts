import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ads-right',
  template:`
  <div class="card ads">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="8059130774"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsRightComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   setTimeout(()=>{
     try{
       (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
     }catch(e){
       console.error("error");
     }
   },2000);
}
}

@Component({
  selector: 'app-ads-right-2',
  template:`
  <div class="card ads">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="7581452770"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsRight2Component implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   setTimeout(()=>{
     try{
       (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
     }catch(e){
       console.error("error");
     }
   },2000);
}
}

@Component({
  selector: 'app-ads-content-match',
  template:`
  <div class="card ads">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="3406213036"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsContentMatchComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   // setTimeout(()=>{
     try{
       (window['adsbygoogle'] = window['adsbygoogle'] || []).push({});
     }catch(e){
       console.error("error");
     }
   //},2000);
}
}
export const ADS_COMPONENTS = [
  AdsRightComponent,
  AdsRight2Component,
  AdsContentMatchComponent
]
