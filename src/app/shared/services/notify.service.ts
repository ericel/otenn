import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
export interface Msg {
  content: string;
  style: string;
}
@Injectable()
export class NotifyService {

  private _msgSource = new Subject<Msg | null>();
  msg = this._msgSource.asObservable();

  update(content: string, style: 'error' | 'info' | 'success') {
    const msg: Msg = { content, style };
    this._msgSource.next(msg);
    setTimeout(() => {
      this.clear()
    }, 5000)
  }
  clear() {
    this._msgSource.next(null);
  }

  getCurrentTime() {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  }
}
