import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@shared/services/notify.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  constructor(public _notify: NotifyService) { }

  ngOnInit() {
  }

}
