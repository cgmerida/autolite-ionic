import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/app/order.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  // private products: Product[];
  // private services: Service[];
  // private cars: Observable<Car[]>;

  // private slideOpts = {
  //   slidesPerView: 1.5,
  //   loop: true,
  //   centeredSlides: true,
  //   spaceBetween: 10
  // };

  private totalOrders = 0;
  private loading = true;
  private totalExpenses = 0;

  constructor(
    private orderServcice: OrderService
  ) {

  }

  ngOnInit() {
    this.orderServcice.getCompletedOrdersByUser()
      .then(orders$ => {
        orders$.subscribe(orders => {

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

        })
      })
  }

}
