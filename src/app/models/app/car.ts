import { User } from '../user';
import { Km } from './km';

enum TransmitonTypes { Automatica = 'Automatica', Mecanica = "Mecanica" };

export class Car {
  uid?: string;
  brand: string;
  line: string;
  model: number;
  engine: number;
  transmition: TransmitonTypes;
  color: string;
  license: string;
  owner: User["uid"];
  km: Km[];
  createdAt: Date;
  updatedAt: Date;
}