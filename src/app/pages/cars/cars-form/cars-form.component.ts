import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { CarService } from 'src/app/services/app/car.service';
import { Car } from 'src/app/models/app/car';

import { Plugins, CameraResultType, Capacitor } from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';
import { ErrorService } from 'src/app/services/error.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

const { Camera } = Plugins;

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

  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;

  isDesktop: boolean;

  uploadFile: File | Blob;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private carService: CarService,
    private loadingController: LoadingController,
    private alertCtl: AlertController,
    private storageService: StorageService,
    private errorService: ErrorService,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {

    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;
    }

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


  async takePicture(type: string) {
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });

      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));

      const file = await fetch(image.webPath).then(r => r.blob());
      this.uploadFile = file;

    } catch (err) {
      this.presentAlert(`Error`, `No se obtuvo imagen`, err);
    }
  }



  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    this.uploadFile = file;

    if (!file.type.match(pattern)) {
      console.log('Archivo no valido');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }


  get errorControl() {
    return this.carsForm.controls;
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


  async registrar() {
    let downloadImg,
      loading,
      filename = `${this.carsForm.get("brand").value}_${this.carsForm.get("line").value}`;

    try {
      downloadImg = await this.storageService.uploadCar(this.uploadFile, filename);
    } catch (err) {
      this.presentAlert(`Error`, null, this.errorService.printErrorByCode(err.code));
    }

    this.loadingController.create()
      .then(loading => {
        loading.present();
        this.carService.addCar({ ...this.carsForm.value, photo: downloadImg })
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
