import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { CarService } from 'src/app/services/app/car.service';
import { Car } from 'src/app/models/app/car';

import { Plugins, CameraResultType } from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-cars-form',
  templateUrl: './cars-form.component.html',
  styleUrls: ['./cars-form.component.scss'],
})
export class CarsFormComponent implements OnInit {

  // Data passed in by componentProps
  @Input() update: boolean;
  @Input() car: Car;

  private carsForm: FormGroup;
  isSubmitted = false;


  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private carService: CarService,
    private loadingController: LoadingController,
    private alertCtl: AlertController,
    private storageService: StorageService,
    private errorService: ErrorService,
  ) {

  }

  ngOnInit() {
    this.carsForm = this.formBuilder.group({
      brand: [this.car ? this.car.brand : null, Validators.required],
      line: [this.car ? this.car.line : null, Validators.required],
      model: [this.car ? this.car.model : null, [Validators.required, Validators.pattern(/^(19[789]|20[012])\d$/)]],
      transmition: [this.car ? this.car.transmition : 'Automatica', [Validators.required, Validators.pattern(/^(Automatica|Mecanica)$/)]],
      color: [this.car ? this.car.color : null, Validators.required],
      license: [this.car ? this.car.license : null, [Validators.required, Validators.pattern(/^(\w{1,3})?\d{3,3}\w{3,3}$/)]]
    });
  }

  dismiss() {
    this.modalController.dismiss();

    // this.modalController.dismiss(DATA);
  }


  onSubmit() {
    this.isSubmitted = true;

    if (!this.carsForm.valid) {
      return false;
    }


    if (this.update) {
      this.actualizar();
    } else {
      this.registrar();
    }
  }


  async takePicture(img) {

    if (!this.carsForm.get("brand").value || !this.carsForm.get("line").value) {

      this.presentAlert(`Error`, null, `Debe llenar el formulario.`);
      return;
    }

    const { Camera } = Plugins;

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      img.src = image.webPath;

      const blob = await fetch(image.webPath).then(r => r.blob());

      this.storageService.uploadCar(blob, `${this.carsForm.get("brand").value}_${this.carsForm.get("line").value}`)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          throw new Error(err);
        });


    } catch (err) {
      console.log(err);
      if (err.code) {
        this.presentAlert(`Error`, null, this.errorService.printErrorByCode(err.code));
      } else {
        this.presentAlert(`Error`, null, `No se pudo acceder a la camara.`);
      }
    }
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
          });
      });
  }

  actualizar() {
    this.loadingController.create()
      .then(loading => {
        loading.present();
        // this.carService.addCar({ ...this.carsForm.value })
        this.carService.updateCar({
          uid: this.car.uid,
          ...this.carsForm.value
        })
          .then(() => {
            this.presentAlert(`¡Genial!`, null, `Información Actualizada.`);
            this.dismiss();
          })
          .catch((error) => {
            this.presentAlert(`Error`, null, `Problema registrando el vehículo`);
            console.log(error);
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }

  changeValue(value) {
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
