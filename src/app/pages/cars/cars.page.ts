import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { CarsFormComponent } from './cars-form/cars-form.component';
import { CarService } from 'src/app/services/app/car.service';
import { Car } from 'src/app/models/app/car';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { Km } from 'src/app/models/app/km';

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
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.carService.getCarsByUser()
      .then(obs => {
        obs.subscribe(cars => {
          cars.map(car => {
            if (car.km) {
              this.carService.getCarKm(car.km).subscribe((km: Km) => {
                car.km = km;
              });
            }
          });
          this.cars = cars;
        })
      })

  }

  km(car) {
    car.addKm = true
  }

  onSubmitKm(car, km) {
    const kmInt = parseInt(km);
    console.log(kmInt);

    if (!kmInt || kmInt <= 0) {
      this.presentAlert('Error', `Ingrese un Kilometraje válido`);
      return false;
    }

    this.loadingController.create()
      .then(loading => {
        loading.present();

        this.carService.addKm({
          km: km,
          car: car.uid,
          oldKm: (!!car.km ? car.km.km : 0)
        })
          .then((res) => {
            this.presentAlert('¡Bien!', res);
          })
          .catch((err) => {
            this.presentAlert('Error', `${err}`);
          })
          .finally(() => {
            loading.dismiss();
            car.addKm = false
          });
      })
  }


  editar(car: Car) {
    this.presentModal(true, car);
  }

  eliminar(uid) {
    this.loadingController.create()
      .then(loading => {
        loading.present();
        this.carService.deleteCar(uid)
          .then(() => {
            this.presentAlert('¡Bien!', 'Carro Eliminado');
          })
          .catch((err) => {
            this.presentAlert('Error', `Hubo un problema.\n Descripcion: ${err}`);
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }

  async presentModal(update = false, car = null) {
    let modalConfig = {
      component: CarsFormComponent,
      componentProps: {
        'update': update,
        'car': car
      }
    }
    const modal = await this.modalController.create(modalConfig);
    await modal.present();
  }


  async presentAlert(hdr, msg) {
    const alert = await this.alertController.create({
      header: hdr,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


}
