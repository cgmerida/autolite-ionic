import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/app/order.service';
import { Order } from 'src/app/models/app/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
 
  orders: Observable<Order[]>;
  // orders: Order[];

  private statusColor = {"Nuevo":"dark", "En Progreso": "tertiary", "Completado": "success"};

  constructor(private orderService: OrderService) {

   }

  async ngOnInit() {
    
    this.orders = await this.orderService.getOrdersByUser();
  }
}
