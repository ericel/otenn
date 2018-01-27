import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@shared/services/notify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _notify: NotifyService
  ) { }

  ngOnInit() {
  }
 

  onClose() {
     this._notify.update('<strong>Oop! Action Not Permitted!</strong> Can\'t close that window.', 'error');
  }
}
