import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { ListResponseModel } from '../models/listResponseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl = 'https://localhost:44318/api/customers/';
  constructor(private httpClient: HttpClient) { }

  getCustomers():Observable<ListResponseModel<Customer>> {
    return this.httpClient.get<ListResponseModel<Customer>>(this.apiUrl);
  }

  getCustomerById(customerId: number): Observable<ListResponseModel<Customer>> {
    let newPath = this.apiUrl + 'getcustomerdetailbycustomerid?customerId=' + customerId;
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  getCustomerByEmail(email: string): Observable<SingleResponseModel<Customer>> {
    let emailPath = this.apiUrl + 'getbyemail?email=' + email;
    return this.httpClient.get<SingleResponseModel<Customer>>(emailPath);
 }
}
