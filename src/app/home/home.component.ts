import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'
@Component({
  selector: 'app-home',
  template: `
  <div *ngIf="displayLogin">
      <app-login></app-login>
    </div>
    <div *ngIf="!displayLogin">
      <span class="mat-display-3">You get a lemon, you get a lemon, you get a lemon...</span>
    </div>
  `,
  styles: [`div[fxLayout] {margin-top:32px}`]
})
export class HomeComponent implements OnInit {
  private _displayLogin = true
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.authStatus.subscribe(data=>{
      this._displayLogin=!data.isAuth
    })
  }
  get displayLogin(){
    return this._displayLogin
  }
}
