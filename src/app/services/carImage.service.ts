import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { CarImage } from '../models/carImage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {
  
  apiUrl = 'https://localhost:44318/api/carimages/getall';
  constructor(private httpClient: HttpClient) { }

  getCarImagesByCarId(id:number){
    let newPath = this.apiUrl+"/carimages/getimagesbycarid?Id="+id;
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath)
  }
}