import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: Observable<User[]>;

  constructor(
    private userService: UserService,
    private fireAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.users = this.userService.getUsers();

    // this.fireAuth.authState.subscribe(fireUser => {
    //   fireUser.delete()
    // });
    // this.fireAuth.currentUser.then(fireUser => {
    //   fireUser.delete()
    // })
  }

}
