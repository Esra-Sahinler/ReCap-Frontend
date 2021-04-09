import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Car } from 'src/app/models/car';
import { Card } from 'src/app/models/card';
import { Customer } from 'src/app/models/customer';
import { Rental } from 'src/app/models/rental';
import { CarService } from 'src/app/services/car.service';
import { CardService } from 'src/app/services/card.service';
import { CustomerService } from 'src/app/services/customer.service';
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

  constructor(
    private activateRoute: ActivatedRoute,
    private carService: CarService,
    private customerService: CustomerService,
    private router: Router,
    private toastrService: ToastrService,
    private rentalService: RentalService,
    private CardService: CardService
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
      moneyInTheCard: this.card.moneyInTheCard
    };
    this.cardExist = await this.isCardExist(card);
    if (this.cardExist) {
      this.card = await this.getCardByCardNumber(this.cardNumber);
      if (this.card.moneyInTheCard >= this.amountOfPayment) {
        this.card.moneyInTheCard =
          this.card.moneyInTheCard - this.amountOfPayment;
        this.updateCard(card);
        this.rentalService.addRental(this.rental);
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
    return (await this.CardService.isCardExist(card).toPromise())
      .success;
  }

  async getCardByCardNumber(cardNumber: string) {
    return (await this.CardService.getCardByNumber(cardNumber).toPromise())
      .data[0];
  }

  updateCard(card: Card) {
    this.CardService.updateCard(card);
  }
}
