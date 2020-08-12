import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Order } from 'src/app/models/app/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private orderCollection: AngularFirestoreCollection<Order>;

  constructor(private db: AngularFirestore) {
    this.orderCollection = this.db.collection<Order>('orders');
  }

  
  getOrders() {
    return this.orderCollection.valueChanges({ idField: 'uid' });
  }

  
  addOrder(order: Order) {
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
