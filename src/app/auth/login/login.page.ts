import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtl: AlertController,
    private loadingController: LoadingController,
    private errors: ErrorService,
  ) { }

  ngOnInit() {
  }

  logIn(email, password) {
    this.loadingController.create()
      .then(loading => {
        loading.present();
        this.authService.LogIn(email, password)
          .then((res) => {
            if (res.user.emailVerified) {
              this.router.navigate(['/app/inicio']);
            } else {
              this.presentAlert('Correo no verificado.');
              return false;
            }
          })
          .catch((error) => {
            this.presentAlert(this.errors.printErrorByCode(error.code));
          })
          .finally(() => {
            loading.dismiss();
          });
      });
  }


  async presentAlert(msg) {
    const alert = await this.alertCtl.create({
      // cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: 'Problema iniciando sesión.',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
