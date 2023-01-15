import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, of, switchMap, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import IClip from '../models/clip.model';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  public clipCollection: AngularFirestoreCollection<IClip>
 pageClips : IClip[] = [];
 pendingReq = false;
constructor(private db: AngularFirestore,
            private auth: AngularFireAuth,
            private storage: AngularFireStorage,
            private router: Router) {
  this.clipCollection = db.collection('clips')
 }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
    return this.clipCollection.doc(route.params.id).get().pipe(
      map(snapshot => {
        const data = snapshot.data()
        if(!data){
          this.router.navigate(['/'])
          return null;
        }
        return data;
      })
    )
  }
 createClip(data: IClip) : Promise<DocumentReference<IClip>> {
  return this.clipCollection.add(data)
 }

 getUserClips(sort$: BehaviorSubject<string>) {
  return combineLatest([this.auth.user,
    sort$]).pipe(
    switchMap(values => {
      const [user, sort] = values
      if(!user) {
        return of([])
      }
      const query = this.clipCollection.ref.where(
        'uid', '==', user.uid
      ).orderBy(
        'timestamp',
        sort === '1' ? 'desc' : 'asc'
      )
      return query.get()
    }),
    map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
  )
 }
 updateClip(id: string, title: string){
  return this.clipCollection.doc(id).update({
    title
  })
 }
 async deleteClip(clip:IClip){
  const clipRef = this.storage.ref(`clips/${clip.fileName}`)
  const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)

  await clipRef.delete();
  await screenshotRef.delete();
  await this.clipCollection.doc(clip.docID).delete()
 }

 async getClips() {
  if(this.pendingReq){
    return
  }
  this.pendingReq = true;
  let query = this.clipCollection.ref.orderBy('timestamp', 'desc')
  .limit(3)

  const {length} = this.pageClips;

  if(length){
    const lastDocID = this.pageClips[length - 1].docID;
    const lastDoc = await this.clipCollection.doc(lastDocID)
    .get()
    .toPromise()

    query = query.startAfter(lastDoc)

  }

  const snapshot = await query.get();

  snapshot.forEach(doc => {
    this.pageClips.push({
      docID: doc.id,
      ...doc.data()
    })
  })
  this.pendingReq = false;

 }
}
