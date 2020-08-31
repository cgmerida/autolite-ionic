import { Product } from './app/product';

export class Service {
  uid?: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}