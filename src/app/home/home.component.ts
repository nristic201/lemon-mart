import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <div fxLayout='column' fxLayoutAlign="center center">
    <span class="mat-display-2">Hello, Lemonite</span>
    <button mat-raised-button routerLink='/manager' color='primary'>Login as Manager</button>
  </div>
  `,
  styles: [`div[fxLayout] {margin-top:32px}`]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
