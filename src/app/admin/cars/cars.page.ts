import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CarService } from 'src/app/services/app/car.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
})
export class CarsPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private carService: CarService
  ) { }

  ngOnInit() {
  }

  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: ModalPage,
  //     cssClass: 'my-custom-class'
  //   });
  //   return await modal.present();
  // }

}
