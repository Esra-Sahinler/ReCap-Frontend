import { Car } from "./car";
import { ResponseModel } from "./responseModel";

export interface CarDetailResponseModel extends ResponseModel{
    data:Car[]
}