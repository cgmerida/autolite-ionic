import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
  }

  enviarInicio() {
    this.authService.fireAuth.currentUser
      .then((user) => {
        user.reload();
        // user.getIdTokenResult(true);
      });

    setTimeout(() => {
      this.authService.fireAuth.currentUser
        .then((user) => {
          if (user && user.emailVerified) {
            this.authService.router.navigate(['/app/inicio']);
          } else {
            this.presentAlert('No has verificado tu correo');
          }
        })
    }, 2000);
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
