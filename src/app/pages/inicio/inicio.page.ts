import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/app/product';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/services/app/service.service';
import { Car } from 'src/app/models/app/car';
import { CarService } from 'src/app/services/app/car.service';

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
    slidesPerView: 1.3,
    loop: true,
    autoplay: true,
    centeredSlides: true,
    spaceBetween: 10
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private carService: CarService,
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

}
