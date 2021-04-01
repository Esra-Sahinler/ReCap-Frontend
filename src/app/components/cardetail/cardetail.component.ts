import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CarDetail } from 'src/app/models/carDetail';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { CarDetailService } from 'src/app/services/carDetail.service';

@Component({
  selector: 'app-cardetail',
  templateUrl: './cardetail.component.html',
  styleUrls: ['./cardetail.component.css'],
})
export class CarDetailComponent implements OnInit {
  constructor(
    private carDetailService: CarDetailService,
    private activatedRoute: ActivatedRoute
  ) {}
  carDetails: CarDetail[] = [];
  dataLoaded = false;
  carImageBasePath = 'https://localhost:44309/';
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['Id']) {
        this.getCarDetailByCarId(params['Id']);
      }
    });
  }

  getCarDetailByCarId(Id: number) {
    this.carDetailService.getCarDetailByCarId(Id).subscribe((response) => {
      this.carDetails = response.data;
      this.dataLoaded = true;
    });
  }
}
