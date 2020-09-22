import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { flatMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(
    private db: AngularFirestore,
    private fireAuth: AngularFireAuth,
  ) {
    this.userCollection = this.db.collection<User>('users');
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.uid)
      .set(user);
  }

  getUsers() {
    return this.userCollection.valueChanges();
  }


  getUser(uid: User["uid"]) {
    return this.userCollection.doc<User>(uid).valueChanges();
  }

  getAuthUser() {
    return this.fireAuth.authState
      .pipe(
        flatMap(fireUser => {
          if (fireUser)
            return this.db.doc<User>(`users/${fireUser.uid}`).valueChanges();
        }),
      );
  }

  updateUser(user) {
    return this.userCollection.doc<User>(user.uid).update(user);
  }

  delUser(user) {
    return this.userCollection.doc<User>(user.uid).delete();
  }
}
