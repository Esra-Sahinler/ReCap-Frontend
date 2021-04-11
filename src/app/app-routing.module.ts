import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { BrandUpdateComponent } from './components/brand-update/brand-update.component';
import { CarAddComponent } from './components/car-add/car-add.component';
import { CarUpdateComponent } from './components/car-update/car-update.component';
import { CarComponent } from './components/car/car.component';
import { CarDetailComponent } from './components/cardetail/cardetail.component';
import { ColorAddComponent } from './components/color-add/color-add.component';
import { ColorUpdateComponent } from './components/color-update/color-update.component';
import { LoginComponent } from './components/login/login.component';
import { RentalComponent } from './components/rental/rental.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {path:"",pathMatch:"full",  component:CarComponent},
  {path:"cars", component:CarComponent},
  {path:"cars/brand/:brandId", component:CarComponent},
  {path:"cars/color/:colorId", component:CarComponent},
  {path:"cars/detail/:Id", component:CarDetailComponent},
  {path:"cars/filter/:brandId/:colorId", component:CarComponent },
  {path:"cars/rental/:Id", component:RentalComponent },
  {path:"cars/add", component:CarAddComponent, canActivate:[LoginGuard] },
  {path:"brands/add", component:BrandAddComponent, canActivate:[LoginGuard]},
  {path:"colors/add", component:ColorAddComponent, canActivate:[LoginGuard]},
  {path:"brands/update", component:BrandUpdateComponent, canActivate:[LoginGuard]},
  {path:"colors/update", component:ColorUpdateComponent, canActivate:[LoginGuard]},
  {path:"cars/update", component:CarUpdateComponent, canActivate:[LoginGuard]},
  {path:"login", component:LoginComponent},
  {path:"register", component:LoginComponent}
  //{path:"card", component:CardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
