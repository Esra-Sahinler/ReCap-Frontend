import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { RegisterModel } from 'src/app/models/register';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
   customer: Customer;

  constructor(private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
       firstName: ['', Validators.required],
       lastName: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
       password: ['', Validators.required]
    });
 }

 register() {
    if (this.registerForm.valid) {
      let registerModel: RegisterModel = Object.assign({}, this.registerForm.value);
    this.authService.register(registerModel).subscribe(responseSuccess => {
       this.localStorageService.setToken(responseSuccess.data);
       this.getCustomerByEmail(registerModel.email);
       this.toastrService.success(responseSuccess.message, 'Başarılı');

       return this.router.navigate(['/cars']);
    }, responseError => {
       if (responseError.error.ValidationErrors) {
          for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
             this.toastrService.error(
                responseError.error.ValidationErrors[i].ErrorMessage, 'Doğrulama Hatası'
             );
          }
          return;
       }
       this.toastrService.error(
          responseError.status + ' ' + responseError.name, responseError.error
       );
    });
  }
 }

 getCustomerByEmail(email: string) {
    this.customerService.getCustomerByEmail(email).subscribe(responseSuccess => {
       this.customer = responseSuccess.data;
       this.localStorageService.setCurrentCustomer(this.customer);
    });
 }
}
