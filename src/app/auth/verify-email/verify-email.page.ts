import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
  }

  ngOnInit() {
  }

  enviarInicio() {

    this.loadingController.create()
      .then(loading => {
        loading.present();

        this.authService.fireAuth.currentUser
          .then((user) => {
            user.reload();
          });

        setTimeout(() => {
          this.authService.fireAuth.currentUser
            .then((user) => {
              loading.dismiss();
              if (user && user.emailVerified) {
                this.authService.router.navigate(['/app/inicio']);
              } else {
                this.presentAlert('No has verificado tu correo');
              }
            })
        }, 1000);
      });
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: 'Problema válidando correo',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
