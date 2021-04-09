import { Car } from "./car";

export interface CarDetail extends Car{
    Id:number;
    brandName:string;
    colorName:string;
    dailyPrice:number;
    description:string;
    //imagePath:string;
}