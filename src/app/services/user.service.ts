import { Injectable } from '@angular/core';

import { User } from "src/app/models/user";
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map, take, flatMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private fireAuth: AngularFireAuth,
  ) {
    this.userCollection = this.db.collection<User>('users');
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.uid)
      .set({ ...user });
  }

  getUsers() {
    return this.userCollection.valueChanges();
  }


  getUser(uid: User["uid"]) {
    return this.userCollection.doc<User>(uid).valueChanges();
  }

  getAuthUser() {
    return this.fireAuth.authState.pipe(
      flatMap(fireUser => fireUser ? this.userCollection.doc<User>(fireUser.uid).valueChanges() : [])
    )
  }

  updateUser(user: User) {
    return this.userCollection.doc<User>(user.uid).update(user);
  }
}
