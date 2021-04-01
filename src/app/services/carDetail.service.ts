import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarDetail } from '../models/carDetail';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CarDetailService {
  apiUrl="https://localhost:44318/api/cars/"

  constructor(private httpClient:HttpClient) { }
  getCarDetailByCarId(Id: number) : Observable<ListResponseModel<CarDetail>>{
    let newApiUrl = this.apiUrl + "cardetailsbyid?id=" + Id;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newApiUrl);
  }
}