export interface Card{
    cardId?:number;
    cardNameSurname:string;
    cardNumber:string;
    validDate:string;
    CVV:string;
    customerId?:number;
    moneyInTheCard:number;
    save:boolean[];
}