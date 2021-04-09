import { Pipe, PipeTransform } from '@angular/core';
import { Car } from '../models/car';

@Pipe({
  name: 'carFilter'
})
export class CarFilterPipe implements PipeTransform {

  transform(value: Car[], filterText: string): Car[] {
    filterText = filterText ? filterText.toLocaleLowerCase():"null"
    return filterText ? value.filter((c:Car)=>c.description.toLocaleLowerCase().indexOf(filterText)!==-1):value;
  }

}
