import { Car } from './car';
import { User } from '../user';
enum status {
  "Nuevo" = "Nuevo",
  "En Progreso" = "En Progreso",
  "Completado" = "Completado"
}

export interface Order {
  uid?: string;
  car: Car["uid"] | Car;
  date: Date;
  services: Object;
  totalPrice?: number;
  progress?: number;
  status?: string;
  owner: User["uid"];
  doneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}