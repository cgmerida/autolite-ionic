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

  private user:User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    ) {
    this.authService.getAuthUser()
      .then(user => {
        return this.userService.getUser(user.uid);
      })
      .then(user$ =>{
        user$.subscribe(user => {
          this.user = user;
        })
      });
  }

  ngOnInit() {
  }

}
