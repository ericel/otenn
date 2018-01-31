import { Component, ChangeDetectorRef, OnDestroy, ViewChild, OnInit } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Observable } from 'rxjs/Observable';
import { MatDrawer } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ MediaMatcher]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatDrawer) trigger: MatDrawer;
  mobileQuery: MediaQueryList;

  fillerNav = Array(10).fill(0).map((_, i) => `Nav Item ${i + 1}`);


  private _mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {

  }

  ngOnInit(){

    this.mobileQuery = this.media.matchMedia('(max-width: 922px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onToggle(e){
    this.trigger.toggle()
  }
}
