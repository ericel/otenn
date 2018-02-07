import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-404',
  template: `
    <main class="main">
    <div class="container-fluid">
        404 Not Found!
    </div>
    </main>
  `,
  styles: [`
  `]
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
