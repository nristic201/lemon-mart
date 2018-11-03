import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sign } from 'fake-jwt-sign'
import * as decode from 'jwt-decode'
import { BehaviorSubject, Observable, of, throwError as ObservableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { Role } from './role.enum'
import { transformError } from '../common/common';

export interface IAuthStatus {
  isAuth: boolean
  userRole: Role
  userID: string
}
interface IServerAuthResponse {
  accessToken: string
}
const defaultAuthStatus = {
  isAuth: false,
  userRole: Role.None,
  userID: null
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authProvider: (email: string, password: string) => Observable<IServerAuthResponse>
  authStatus = new BehaviorSubject<IAuthStatus>(defaultAuthStatus)

  constructor(private httpclient: HttpClient) {
    this.authProvider = this.fakeAuthProvider
  }
  private fakeAuthProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    if (!email.toLowerCase().endsWith('@test.com')) {
      return ObservableThrowError('Failed to login! Email needs to end with @test.com.')
    }
    const authStatus = {
      isAuth: true,
      userID: 'e4d1bc2ab25c',
      userRole: email.toLowerCase().includes('cashier')
        ? Role.Cashier
        : email.toLowerCase().includes('clerk')
          ? Role.Clerk
          : email.toLowerCase().includes('manager')
            ? Role.Manager
            : Role.None,
    } as IAuthStatus

    const authResponse = {
      accessToken: sign(authStatus, 'secret', {
        expiresIn: '1h',
        algorithm: 'none',
      }),
    } as IServerAuthResponse

    return of(authResponse)
  }

  login(email: string, password: string): Observable<IAuthStatus> {
    this.logout()

    const loginResponse = this.authProvider(email, password).pipe(
      map(value => {
        this.setToken(value.accessToken)
        return decode(value.accessToken) as IAuthStatus
      }),
      catchError(transformError)
    )

    loginResponse.subscribe(
      res => {
        this.authStatus.next(res)
      },
      err => {
        this.logout()
        return ObservableThrowError(err)
      }
    )

    return loginResponse
  }

  logout() {
    this.clearToken()
    this.authStatus.next(defaultAuthStatus)
  }

  private setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }

  private getDecodedToken(): IAuthStatus {
    return decode(this.getItem('jwt'))
  }

  getToken(): string {
    return this.getItem('jwt') || ''
  }

  private clearToken() {
    this.removeItem('jwt')
  }
}
