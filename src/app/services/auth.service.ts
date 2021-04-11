import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { LoginModel } from '../models/loginModel';
import { RegisterModel } from '../models/register';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://localhost:44318/api/auth/';
  localStorageService: any;
  constructor(private httpClient:HttpClient) { }

  login(loginModel:LoginModel): Observable<SingleResponseModel<TokenModel>>{
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"login",loginModel)
  }

  register(registerModel: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"register",registerModel)
 }
 
 update(customer: Customer): Observable<SingleResponseModel<TokenModel>> {
  return this.httpClient.put<SingleResponseModel<TokenModel>>(this.apiUrl + 'update',customer);
}

  isAuthenticated(): boolean{
    return !!this.localStorageService.getToken();
  }
}

