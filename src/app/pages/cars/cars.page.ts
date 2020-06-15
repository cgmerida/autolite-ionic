import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CarsFormComponent } from './cars-form/cars-form.component';
import { CarService } from 'src/app/services/app/car.service';
import { Car } from 'src/app/models/app/car';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
})
export class CarsPage implements OnInit {

  private cars: Car[];

  constructor(
    private modalController: ModalController,
    private carService: CarService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.storage.get('user')
      .then(user => {
        this.carService.getCarsByUser(user.uid).subscribe(cars => {
          this.cars = cars;
        })
      })
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: CarsFormComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();
  }

}
