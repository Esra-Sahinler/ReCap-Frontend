import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/car';
import { Rental } from 'src/app/models/rental';
import { RentalResponseModel } from 'src/app/models/rentalResponseModel';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  rentals: Rental[]=[];
  cars:Car[];
  rental: Rental;
  rentDate: Date;
  returnDate: Date;
  rentDateValue: Date;
  isRentBefore: Boolean = false;
  dataLoaded = false;

  constructor(private rentalService:RentalService, private toastrService:ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.getRentals();
  }

  getRentals() {
    this.rentalService.getRentals().subscribe(response=>{
      this.rentals = response.data;
      this.dataLoaded = true;
    });
  }

  getRentMinDate(){

    var today  = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().slice(0,10)
  }
  getReturnMinDate(){
    var today  = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().slice(0,10)
  }

  createRental(){
    let MyRental: Rental = {
      Id: this.rental.Id,
      rentalId: this.rental.rentalId,
      firstName: this.rental.firstName,
      lastName: this.rental.lastName,
      brandName: this.rental.brandName,
      rentDate: this.rentDate,
      returnDate: this.returnDate,
      customerId: this.rental.customerId,
    };
    if (MyRental.customerId == undefined || MyRental.rentDate == undefined) {
      this.toastrService.error("Eksik bilgi girdiniz","Bilgilerinizi kontrol edin")
    } else{
      this.router.navigate(['/payment/', JSON.stringify(MyRental)]);
      this.toastrService.info(
        'Ödeme sayfasına yönlendiriliyorsunuz...',
        'Ödeme İşlemleri'
      );
    }
  }

  checkAvailability() {

    if (!this.isRentBefore) {
      return true;
    } else {
      return this.rentedBeforeCarCheck();
    }
  }
  
  rentedBeforeCarCheck() {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    let today = formatDate(now, 'yyyy/MM/dd', 'en');
    let oldDate = formatDate(this.rental.returnDate, 'yyyy/MM/dd', 'en');
  
    if (this.rental.returnDate == null) {
      return false;
    } else if (oldDate > today) {
      return false;
    }
    else {
      return true;
    }
  }
  
  checkClick(){
    if (this.checkAvailability() == true) {
      if (this.rentDate == null ) {
        this.toastrService.warning("Başlangıç tarihi ve şirket seçimi zorunludur!", "Eksik Form");
      }else{
        if (this.returnDate == null || this.returnDate > this.rentDate) {
          this.toastrService.success("Araç kiralanabilir.", "Araç Uygun");
          this.createRental();
        }else if(this.returnDate < this.rentDate){
          this.toastrService.error("Dönüş tarihi başlangıç tarihinden küçük olamaz!");
        }else if (this.returnDate == this.rentDate){
          this.toastrService.error("Kiralama işlemi en az 1 gün olmalıdır!");
        }
      }
    }else{
      this.toastrService.warning("Araç kiralama işlemi gerçekleşemez.", "Araç Kullanımda");
    }
  }
}
