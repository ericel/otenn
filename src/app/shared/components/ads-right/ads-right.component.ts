import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';
import { WINDOW } from '@shared/services/windows.service';
@Component({
  selector: 'app-ads-right',
  template:`
  <div class="ads card">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="8059130774"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsRightComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject( WINDOW) private window
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  // setTimeout(()=>{
  if (isPlatformBrowser(this.platformId)) {
     try {
       (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
     } catch(e) {
       //console.error("error");
     }
   }
  // },2000);
}
}

@Component({
  selector: 'app-ads-right-2',
  template:`
  <div class="ads card">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="7581452770"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsRight2Component implements OnInit, AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject( WINDOW) private window,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   //setTimeout(()=>{
    if (isPlatformBrowser(this.platformId)) {
      try {
        (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
      } catch(e) {
        //console.error("error");
      }
    }
  // },2000);
}
}

@Component({
  selector: 'app-ads-content-match',
  template:`
  <div class="ads card">
  <ins class="adsbygoogle"
  style="display:block"
  data-ad-client="ca-pub-2243338195594977"
  data-ad-slot="3406213036"
  data-ad-format="auto"></ins>
  </div>`,
  styleUrls: ['./ads-right.component.css']
})
export class AdsContentMatchComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    @Inject( WINDOW) private window,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
   // setTimeout(()=>{
    if (isPlatformBrowser(this.platformId)) {
      try {
        (this.window['adsbygoogle'] = this.window['adsbygoogle'] || []).push({});
      } catch(e) {
        //console.error("error");
      }
    }
   //},2000);
}
}
export const ADS_COMPONENTS = [
  AdsRightComponent,
  AdsRight2Component,
  AdsContentMatchComponent
]
