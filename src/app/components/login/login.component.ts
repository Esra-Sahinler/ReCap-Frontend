import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { LoginModel } from 'src/app/models/loginModel';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup
  customer: Customer;
  currentCustomerEmail: string = '';

  constructor(private formBuilder:FormBuilder, 
    private authService:AuthService, 
    private toastrService:ToastrService,  
    private router: Router,
    private localStorageService: LocalStorageService,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.setCurrentCustomerEmail();
    this.createLoginForm();
  }

  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email: [this.currentCustomerEmail, [Validators.required, Validators.email]],
      password: ["",Validators.required]
    })
  }

  login(){
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      let loginModel:LoginModel = Object.assign({},this.loginForm.value)

      this.authService.login(loginModel).subscribe(response=>{
        this.toastrService.success(response.message,"Başarılı");
        this.localStorageService.setToken(response.data)
        this.getCustomerByEmail(loginModel.email);

        return this.router.navigate(['/cars'])
      },responseError=>{
        //console.log(responseError)
        return this.toastrService.error(responseError.error,"Hata");
      })
    }
  }

  getCustomerByEmail(email: string) {
    this.customerService.getCustomerByEmail(email).subscribe(responseSuccess => {
       this.customer = responseSuccess.data;
       this.localStorageService.setCurrentCustomer(this.customer);
    });
 }

 setCurrentCustomerEmail() {
  return this.localStorageService.getCurrentCustomer()
     ? this.currentCustomerEmail = this.localStorageService.getCurrentCustomer().email
     : null;
  }
}

