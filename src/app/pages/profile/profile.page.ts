import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.userService.getAuthUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.user.photoURL = this.user.photoURL ? this.user.photoURL :
          `https://ui-avatars.com/api/?size=200&background=079db6&color=fff&name=${user.firstname}+${user.lastname}`;
      }
    })
  }
  ngOnInit() {
  }

  async logOut() {
    await this.authService.SignOut();
  }
  updateUrl() {
    this.user.photoURL = 'https://southernplasticsurgery.com.au/wp-content/uploads/2013/10/user-placeholder.png';
  }

}
