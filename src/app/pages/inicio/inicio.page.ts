import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/app/order.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  // private slideOpts = {
  //   slidesPerView: 1.5,
  //   loop: true,
  //   centeredSlides: true,
  //   spaceBetween: 10
  // };

  private userSub: Subscription;
  private orderSub: Subscription;

  user: User;

  totalOrders = 0;
  loading = true;
  totalExpenses = 0;

  constructor(
    private orderServcice: OrderService,
    private userService: UserService,
  ) {

  }

  ionViewWillEnter() {
    this.userSub = this.userService.getAuthUser().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.orderServcice.getCompletedOrdersByUser().then(orders$ => {
      this.orderSub = orders$.subscribe(orders => {

        orders.forEach(order => {
          this.totalOrders++;
          order.services.forEach(service => {
            this.totalExpenses += Math.round(service.price * 100) / 100;
            if (service.hasOwnProperty('products') && service.products.length > 0) {
              service.products.forEach(product => {
                this.totalExpenses += Math.round(product.price * 100) / 100;
              });
            }
          })
        })

        this.loading = false;

      });
    });
  }

  ionViewWillLeave() {
    this.userSub.unsubscribe();
    this.orderSub.unsubscribe();
  }

}
