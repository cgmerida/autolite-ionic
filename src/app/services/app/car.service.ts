import { Injectable } from '@angular/core';

import { Car } from 'src/app/models/app/car';

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private carCollection: AngularFirestoreCollection<Car>;
  private cars: Observable<Car[]>;


  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.carCollection = this.db.collection<Car>('cars');
    // Obtiene todos los carros
    // this.cars = this.carCollection.valueChanges();
  }

  getAllCars() {
    return this.carCollection.valueChanges();
  }

  getCarsByUser(uid: User['uid']) {
    return this.db.collection<Car>('cars', ref => ref.where('owner', '==', uid)).valueChanges();
  }

  addCar(car: Car) {
    car.createdAt = new Date();
    car.updatedAt = new Date();
    return this.authService.getAuthUserUid()
      .then(uid => {
        car.owner = uid
        return this.carCollection.add({ ...car });
      })
      .then(() => {
        return `Carro registrado`;
      });
  }

  updateCar(car: Car) {
    car.updatedAt = new Date();
    return this.carCollection.doc(car.uid).update({
      brand: car.brand,
      model: car.model,
      engine: car.engine,
      trasmition: car.trasmition,
      color: car.color,
      license: car.license,
    });

  }

  deleteCar(car: Car) {
    return this.carCollection.doc(car.uid).delete();
  }

}
