import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Car } from 'src/app/models/car';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { CarService } from 'src/app/services/car.service';
import { CarImageService } from 'src/app/services/carImage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cardetail',
  templateUrl: './cardetail.component.html',
  styleUrls: ['./cardetail.component.css'],
})
export class CarDetailComponent implements OnInit {

  carDetails: CarDetail[] = [];
  //cars: Car[] = [];
  carImages: CarImage[];

  constructor(
    private carService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['Id']) {
        this.getCarDetailsById(params["Id"]);
       }else if (params['Id']) {
      this.getCarImagesByCarId(params["Id"]);
     } else {
       //this.getCars();
     }
    });
  }

 // getCars() {
   // this.carService.getCars().subscribe((response) => {
     // this.carsDetails = response.data;
    //});
 // }

   getCarDetailsById(Id: number) {
     this.carService.getCarDetailsById(Id).subscribe((response) => {
       this.carDetails = response.data;
     });
   }

  getCarImagesByCarId(id: number) {
    this.carImageService.getCarImagesByCarId(id).subscribe(response => {
      this.carImages = response.data;
    })
  }

  setImage() {
    for (let i = 0; i < this.carImages.length; i++) {
      const carImage = this.carImages[i];
      if (carImage.imagePath) {
        return environment.staticFilesUrl + carImage.imagePath;
      }
    }
    return environment.staticFilesUrl + "/Images/logo.jpg";
  }
}
