import { Component } from '@angular/core';
import { OrderFormComponent } from '../pages/order-form/order-form.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private modalController: ModalController) { }



  async registrarOrden() {
    let modalConfig = {
      component: OrderFormComponent,
      swipeToClose: true,
      cssClass: 'my-modal',
    }
    const modal = await this.modalController.create(modalConfig);
    await modal.present();
  }


}
