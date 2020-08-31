import { Car } from './car';
import { User } from '../user';
import { Service } from '../service';
enum status {
  "Nuevo" = "Nuevo",
  "En Progreso" = "En Progreso",
  "Completado" = "Completado"
}

export interface Order {
  uid?: string;
  car: Car["uid"] | Car;
  date: Date;
  services: Service[];
  totalPrice?: number;
  progress?: number;
  status?: string;
  owner: User["uid"];
  doneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}