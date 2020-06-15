import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { CarService } from 'src/app/services/app/car.service';
import { Car } from 'src/app/models/app/car';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss'],
})
export class CarsFormComponent implements OnInit {

  private carsForm: FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private carService: CarService,
    private loadingController: LoadingController,
    private alertCtl: AlertController,
  ) {
    this.carsForm = this.formBuilder.group({
      brand: [null, Validators.required],
      model: [null, [Validators.required, Validators.pattern(/^(19[789]|20[012])\d$/)]],
      transmition: [null, [Validators.required, Validators.pattern(/^(Automatica|Mecanica)$/)]],
      color: [null, Validators.required],
      license: [null, [Validators.required, Validators.pattern(/^(\w{1,3})?\d{3,3}\w{3,3}$/)]]
    });
  }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss();

    // this.modalController.dismiss(DATA);
  }


  onSubmit() {
    this.isSubmitted = true;

    if (!this.carsForm.valid) {
      return false;
    }

    this.registrar();
  }


  get errorControl() {
    return this.carsForm.controls;
  }

  registrar() {
    this.loadingController.create()
      .then(loading => {
        loading.present();
        this.carService.addCar({ ...this.carsForm.value })
          .then((res) => {
            this.presentAlert(`¡Genial!`, null, res);
            this.dismiss();
          })
          .catch((error) => {
            this.presentAlert(`Error`, null, `Problema registrando el vehículo`);
            console.log(error);
          })
          .finally(() => {
            loading.dismiss();
            console.log('despues de add car')
          });
      });
  }

  changeValue(value){
    console.log(value);
    this.carsForm.get('transmition').patchValue(value);
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
