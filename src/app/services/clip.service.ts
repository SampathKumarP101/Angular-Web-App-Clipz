import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipCollection: AngularFirestoreCollection<IClip>

constructor(private db: AngularFirestore) {
  this.clipCollection = db.collection('clips')
 }
 async createClip(data: IClip) {
  await this.clipCollection.add(data)
 }
}
