import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Title, Meta} from "@angular/platform-browser"; 

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) {
   
 }

  ngOnInit() {
    this.title.setTitle('About Us');
    this.meta.addTags([
      { name: 'keywords', content: 'Otenn, share all'},
      { name: 'description', content: 'We\'re building bridges, unifying the one people Africa. Find People, places, business networks all in shakedown' }
    ]);
  }

}
