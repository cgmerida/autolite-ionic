import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: Observable<User[]>;

  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  async addAdmin(userUid) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.updateUser({ uid: userUid, isAdmin: true });
    await loading.dismiss();
  }

  async removeAdmin(userUid) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.updateUser({ uid: userUid, isAdmin: false });
    await loading.dismiss();
  }

  async lockUser(userUid) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.updateUser({ uid: userUid, disabled: true });
    await loading.dismiss();
  }

  async unlockUser(userUid) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.updateUser({ uid: userUid, disabled: false });
    await loading.dismiss();
  }


  async delUser(userUid) {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.userService.delUser({ uid: userUid });
    await loading.dismiss();
  }

}