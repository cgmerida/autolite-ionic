import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/app/product';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/services/app/service.service';
import { Car } from 'src/app/models/app/car';
import { CarService } from 'src/app/services/app/car.service';
import { ModalController } from '@ionic/angular';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  private products: Product[];
  private services: Service[];
  private cars: Observable<Car[]>;

  private slideOpts = {
    slidesPerView: 1.5,
    loop: true,
    centeredSlides: true,
    spaceBetween: 10
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private carService: CarService,
    private modalController: ModalController
  ) {
    productService.getProducts().subscribe(products => {
      if (products.length > 5) {
        this.products = products.filter(product => Math.round(Math.random()));
      } else {
        this.products = products;
      }
    });

    serviceService.getServices().subscribe(services => {
      if (services.length > 5) {
        this.services = services.filter(service => Math.round(Math.random()));
      } else {
        this.services = services;
      }
    });

    carService.getCarsByUser().then(carsObs => {
      this.cars = carsObs;
    });
  }

  ngOnInit() {
  }

  
  async registrarOrden() {
    let modalConfig = {
      component: OrderFormComponent,
      swipeToClose: true,
      cssClass: 'my-modal',
    }
    const modal = await this.modalController.create(modalConfig);
    await modal.present();
  }


}
