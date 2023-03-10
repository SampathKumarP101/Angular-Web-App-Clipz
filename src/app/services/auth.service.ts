import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import IUser from '../models/user.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedwithDelay$: Observable<boolean>;
  private redirect = false;



  constructor(public aroute: ActivatedRoute, private auth: AngularFireAuth, private db: AngularFirestore, public router: Router)
  {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map((user: any) => !!user)
      )
      this.isAuthenticatedwithDelay$ = this.isAuthenticated$.pipe(
        delay(1000)
      )
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => this.aroute.firstChild),
        switchMap(route => route?.data ?? of({}))
      ).subscribe(data => {
        this.redirect = data.authOnly ?? false
      })
  }

  public async createUser(userData: IUser) {
    if(!userData.password)
    {
      throw new Error("Password not Provided!")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    )
    await this.usersCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCred.user?.updateProfile({
      displayName: userData.name
    })
  }

  public async logout($event?: Event){
    if($event){
      $event.preventDefault();
    }
    await this.auth.signOut();
    if(this.redirect){
    await this.router.navigateByUrl('/');
    }
  }
}
