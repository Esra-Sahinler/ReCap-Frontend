import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/car';
import { Card } from 'src/app/models/card';
import { Customer } from 'src/app/models/customer';
import { Rental } from 'src/app/models/rental';
import { CarService } from 'src/app/services/car.service';
import { CardService } from 'src/app/services/card.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RentalService } from 'src/app/services/rental.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  rental: Rental;
  cars: Car;
  customer: Customer;
  getCustomerId: number;
  amountOfPayment: number = 0;
  cardNameSurname: string;
  cardNumber: string;
  CVV: string;
  validDate: string;
  card: Card;
  cardExist: Boolean = false;
  moneyInTheCard:number;
  cardAddForm: FormGroup;
  findeksChecked = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private carService: CarService,
    private customerService: CustomerService,
    private router: Router,
    private toastrService: ToastrService,
    private rentalService: RentalService,
    private cardService: CardService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params) => {
      if (params['rental']) {
        this.rental = JSON.parse(params['rental']);
        this.getCustomerId = JSON.parse(params['rental']).customerId;
        this.getCustomerById(this.getCustomerId);
        this.getCarDetails();
      }
    });
  }

  getCustomerById(customerId: number) {
    this.customerService.getCustomerById(customerId).subscribe((response) => {
      this.customer = response.data[0];
      console.log(response);
    });
  }

  getCarDetails() {
    this.carService.getCarDetailsById(this.rental.Id)
      .subscribe((response) => {
        this.cars = response.data[0];
        this.paymentCalculator();
      });
  }

  paymentCalculator() {
    if (this.rental.returnDate != null) {
      var date1 = new Date(this.rental.returnDate.toString());
      var date2 = new Date(this.rental.rentDate.toString());
      var difference = date1.getTime() - date2.getTime();

      //zamanFark değişkeni ile elde edilen saati güne çevirmek için aşağıdaki yöntem kullanılabilir.
      var numberOfDays = Math.ceil(difference / (1000 * 3600 * 24));

      this.amountOfPayment = numberOfDays * this.cars.dailyPrice;
      if (this.amountOfPayment <= 0) {
        this.router.navigate(['/cars']);
        this.toastrService.error(
          'Araç listesine yönlendiriliyorsunuz',
          'Hatalı işlem'
        );
      }
    }
  }

  async rentACar() {
    let card: Card = {
      cardNameSurname: this.cardNameSurname,
      cardNumber: this.cardNumber,
      validDate: this.validDate,
      CVV: this.CVV,
      moneyInTheCard: this.card.moneyInTheCard,
      save: [true]
    };
    this.cardExist = await this.isCardExist(card);
    if (this.cardExist) {
      this.card = await this.getCardByCardNumber(this.cardNumber);
      if (this.card.moneyInTheCard >= this.amountOfPayment) {
        this.card.moneyInTheCard =
          this.card.moneyInTheCard - this.amountOfPayment;
        this.updateCard(card);
        this.rentalService.add(this.rental);
        this.toastrService.success('Arabayı kiraladınız', 'Işlem başarılı');
      } else {
        this.toastrService.error(
          'Kartınızda yeterli para bulunmamaktadır',
          'Hata'
        );
      }
    } else {
      this.toastrService.error('Bankanız bilgilerinizi onaylamadı', 'Hata');
    }
  }

  async isCardExist(card: Card) {
    return (await this.cardService.isCardExist(card).toPromise())
      .success;
  }

  async getCardByCardNumber(cardNumber: string) {
    return (await this.cardService.getCardByNumber(cardNumber).toPromise())
      .data[0];
  }

  updateCard(card: Card) {
    this.cardService.updateCard(card);
  }

  add() {
    this.rental = Object.assign({}, this.rentalService.getRentingCar());

    if (this.cardAddForm.invalid) {
       return this.toastrService.warning('Bilgilerinizi kontrol ediniz', 'Dikkat');
    }

    if (this.cardAddForm.value.save) {
       delete this.cardAddForm.value.save;
       this.card = Object.assign({}, this.cardAddForm.value);
       this.addCard(this.card);
    }

    return this.addRental(this.rental);
 }

 addCard(card: Card) {
  this.cardService.addCard(card).subscribe(responseSuccess => {
     return responseSuccess.success;
  }, responseError => {
     if (responseError.error.ValidationErrors.length > 0) {
        for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
           this.toastrService.error(
              responseError.error.ValidationErrors[i].ErrorMessage, 'Doğrulama Hatası'
           );
        }

        return;
     }

     this.toastrService.error(responseError.error.Message, responseError.error.StatusCode);
     return;
  });
}
setSelectedCard(cardOnEventing: Card) {
  this.card = Object.assign(cardOnEventing, { save: false });
  this.cardAddForm.setValue(this.card);
}
addRental(rental: Rental) {
  this.rentalService.add(rental).subscribe(responseSuccess => {
     this.toastrService.success(responseSuccess.message, 'Başarılı');
     this.updateCurrentCustomerFindexPoint();

     return this.router.navigate(['']);
  }, responseError => {
     console.log(responseError);
     if (responseError.error.ValidationErrors) {
        for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
           this.toastrService.error(
              responseError.error.ValidationErrors[i].ErrorMessage, 'Doğrulama Hatası'
           );
        }

        return false;
     }

     this.toastrService.error(responseError.error.message, 'Hata');
     return false;
  });
}
updateCurrentCustomerFindexPoint() {
  let currentCustomer = this.localStorageService.getCurrentCustomer();

  this.customerService.getCustomerByEmail(currentCustomer.email).subscribe(response => {
     this.localStorageService.setCurrentCustomer(response.data);
  });
}
}
