import { User } from '../user';

enum TransmitonTypes { Debit, Credit, Virtual };

export class Car {
  uid: string;
  brand: string;
  model: number;
  engine: number;
  trasmition: TransmitonTypes;
  color: string;
  license: string;
  owner: User["uid"];
  createdAt: Date;
  updatedAt: Date;
}