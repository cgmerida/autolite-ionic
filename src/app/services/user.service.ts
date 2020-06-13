import { Injectable } from '@angular/core';

import { User } from "src/app/models/users";
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.userCollection = this.db.collection<User>('users');
  }

  addUser(user: User): Promise<void> {
    return this.userCollection.doc(user.uid)
      .set({ ...user });
  }

  getUser(uid: User["uid"]) {
    return this.userCollection.doc(uid).valueChanges();
  }

  updateUser(user: User){
    return this.userCollection.doc(user.uid).update(user);
  }
}
