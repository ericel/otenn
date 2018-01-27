import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@shared/services/notify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fillerContent = Array(50).fill(0).map(() =>
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
   labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
   laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
   voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
   cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);
   heading = '<h1 class="heading">Send Money To Your Love Ones! With Litle Or No Charges.</h1><h3 class="heading-3">Find Dealers around you.</h3>';
  constructor(private _notify: NotifyService) { }

  ngOnInit() {
  }
  
  onCheck(){
    this._notify.update('<strong>It is working</strong>', 'info')
  }
}
