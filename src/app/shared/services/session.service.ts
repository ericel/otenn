import { Injectable } from '@angular/core';
import { NotifyService } from '@shared/services/notify.service';
import * as moment from 'moment';
@Injectable()
export class SessionService {
   visible: boolean = true;
   ID_LENGTH = 8;
   ALPHABET = '23456789AbdeGJkmNPQrvWxYz';
  constructor(private _notify: NotifyService) { }


generate () {
  let rtn = '';
  for (let i = 0; i < this.ID_LENGTH; i++) {
    rtn += this.ALPHABET.charAt(Math.floor(Math.random() * this.ALPHABET.length));
  }
  return rtn.replace(/\s/g, '');
}


hide() { this.visible = false; }

show() { this.visible = true; }

getCurrentTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}
}

