import { Car } from './car';
import { Service } from '../service';
import { Product } from './product';
import { User } from '../user';

export interface Order {
  uid?: string;
  car: any;
  date: Date;
  services: Array<Service["uid"]>;
  products?: Array<Product["uid"]>;
  totalPrice?: number;
  progress?: number;
  owner: User["uid"];
  doneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // car: {
  //   uid: Car["uid"]
  // };
}