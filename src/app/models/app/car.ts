import { User } from '../user';

enum TransmitonTypes { Automatica = 'Automatica', Mecanica = "Mecanica" };

export class Car {
  uid?: string;
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