import { Car } from './car';
import { Service } from '../service';
import { Product } from './product';

export class Order {
  uid?: string;
  car: Car["uid"];
  date: Date;
  services: Array<Service["uid"]>;
  products?: Array<Product["uid"]>;
  totalPrice?: number;
  progress?: number;
  doneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}