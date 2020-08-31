import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController, Platform } from '@ionic/angular';

import { ErrorService } from 'src/app/services/error.service';
import { OrderService } from 'src/app/services/app/order.service';
import { CarService } from 'src/app/services/app/car.service';
import { Observable } from 'rxjs';
import { Car } from 'src/app/models/app/car';
import { ServiceService } from 'src/app/services/app/service.service';
import { Service } from 'src/app/models/service';
import { map, reduce } from 'rxjs/operators';


@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {

  private orderForm: FormGroup;
  private cars: Observable<Car[]>;
  private services: Observable<Service[]>;
  private minDate = new Date().toDateString();

  clicked: boolean;
  servicesOrder: Service[];

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertCtl: AlertController,
    private errorService: ErrorService,
    private orderService: OrderService,
    private carService: CarService,
    private serviceService: ServiceService,
  ) {

    carService.getCarsByUser().then(cars => {
      this.cars = cars
    });

    this.services = serviceService.getServices();

  }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      car: [null, Validators.required],
      date: [null, Validators.required],
      services: [null, Validators.required],
    });
  }

  get errorControl() {
    return this.orderForm.controls;
  }


  dismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    this.clicked = true;
    if (!this.orderForm.valid) {
      return false;
    }
    this.registrar();
  }


  async registrar() {

    let order = { ...this.orderForm.value };

    this.services.subscribe(services => {
      this.servicesOrder = services.filter(service => order.services.includes(service.uid));
    });

    this.loadingController.create()
      .then(loading => {
        loading.present();
        order.services = this.servicesOrder;
        this.orderService.addOrder(order)
          .then((res) => {
            this.presentAlert(`¡Genial!`, null, res);
            this.dismiss();
          })
          .catch((error) => {
            this.presentAlert(`Error`, null, `Problema registrando el vehículo`);
            console.log(error);
          })
          .finally(() => {
            this.clicked = true;
            loading.dismiss();
          });
      });
  }

  async presentAlert(hdr, shdr, msg) {
    const alert = await this.alertCtl.create({
      header: hdr,
      subHeader: shdr,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


}
