import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { map, switchMap } from 'rxjs/operators';
import { CarService } from './car.service';
import { Observable, combineLatest, of } from 'rxjs';
import { uniq, flatten } from 'lodash'
import { Car } from 'src/app/models/app/car';
import { Order } from 'src/app/models/app/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderCollection: AngularFirestoreCollection<Order>;

  joined$: Observable<any>

  private orders: Order[] = [];

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private carService: CarService,
  ) {
    this.orderCollection = this.db.collection<Order>('orders');
  }


  getOrders() {
    return this.orderCollection.valueChanges({ idField: 'uid' });
  }

  async getOrdersByUser() {
    let uid = await this.authService.getAuthUserUid();

    this.joined$ = this.db.collection<Order>('orders', ref => ref.where('owner', '==', uid)).valueChanges({ idField: 'uid' })
      .pipe(
        switchMap(orders => {
          let carsObs = orders.map(
            order => this.db.doc<Car>(order.car).valueChanges()
          );

          return combineLatest(...carsObs, (...cars) => {
            orders.forEach((order, index) => {
              order.car = cars[index];
            });
            return orders;
          });
        })
      )

    return this.joined$;

  }

  // METODO ESTATICO

  //   this.db.collection<Order>('orders', ref => ref.where('owner', '==', uid)).valueChanges({ idField: 'uid' })
  //   .subscribe(orders => {
  //     orders.forEach(order => {
  //       // this.db.collection<Car>
  //       this.db.doc<Car>(order.car).valueChanges()
  //         .subscribe(car => {
  //           order.car = car;
  //           console.log(JSON.stringify(order));
  //           this.orders.push(order);
  //         })
  //     })
  //   });

  // return this.orders;

  // METODO DINAMICO

  // this.joined$ = this.db.collection<Order>('orders', ref => ref.where('owner', '==', uid)).valueChanges({ idField: 'uid' })
  //     .pipe(
  //       switchMap(orders => {
  //         const carsIds = uniq(orders.map(o => o.car))

  //         return combineLatest(
  //           of(orders),
  //           combineLatest(
  //             carsIds.map(carId =>
  //               this.db.collection<Car>(`cars`, ref => ref.where('uid', '==', carId)).valueChanges()
  //                 .pipe(
  //                   map(cars => cars[0])
  //                 )
  //             )
  //           )
  //         )
  //       }),
  //       map(([orders, cars]) => {

  //         return orders.map(order => {
  //           return {
  //             ...order,
  //             car: cars.find(car => car.uid === order.car.uid)
  //           }
  //         })
  //       })
  //     );

  //   return this.joined$;



  async addOrder(order: Order) {
    let uid = await this.authService.getAuthUserUid();
    order.owner = uid;
    order.createdAt = new Date();
    order.updatedAt = new Date();
    order.date = new Date(order.date);
    return this.orderCollection.add(order)
      .then(() => {
        return `Se registro correctamente su orden`;
      })
      .catch(err => {
        return `Error: ${err}`;
      });
  }

  updateOrder(order: Order) {
    order.updatedAt = new Date();
    return this.orderCollection.doc(order.uid).update(order);
  }

  deleteOrder(uid: Order['uid']) {
    return this.orderCollection.doc(uid).delete();
  }
}
