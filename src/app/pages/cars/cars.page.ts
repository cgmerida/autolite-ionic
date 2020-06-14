import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.page.html',
  styleUrls: ['./cars.page.scss'],
})
export class CarsPage implements OnInit {

  carsForm: FormGroup;

  // currentModal = null;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) {

    this.carsForm = this.formBuilder.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      engine: [null, Validators.required],
      transmition: [null, Validators.pattern('[0-9]{8}')],
      color: [null, Validators.required],
      license: [null, Validators.required]
    });
  }

  ngOnInit() {
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: FormComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();

    // this.currentModal = modal;

    // const { data } = await modal.onWillDismiss();
    // console.log(data);
  }


  // dismiss() {
  //   if (this.currentModal) {
  //     this.currentModal.dismiss().then(() => { this.currentModal = null; });
  //   }
  // }

}
