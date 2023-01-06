import { ClipService } from './../../services/clip.service';
import  firebase  from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  altertMsg = 'Please wait your clip is being uploaded..'
  showAlert = false;
  alertColor = 'blue'
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
isDragOver = false;
file: File | null = null;
nextStep = false;
title = new FormControl('', [
  Validators.required,
  Validators.minLength(3)
])
uploadForm = new FormGroup({
  title: this.title
})
  constructor(private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService) {
    auth.user.subscribe( user => console.log(this.user = user))
  }

  ngOnInit() {
  }
  storeFile(event: Event){
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.nextStep = true;

  }
  uploadFile(){
    this.showAlert = true;
    this.alertColor = 'blue';
    this.altertMsg = 'Please wait your clip is being uploaded..';
    this.inSubmission = true;
    this.showPercentage = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })
    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }
        this.clipsService.createClip(clip)
        this.alertColor = 'green';
        this.altertMsg = 'Success! Your clip is now ready to share with world!.';
        this.showPercentage = true;
        this.showPercentage = false;
      },
      error: (error) => {
        this.alertColor = 'red';
        this.altertMsg = 'Upload failed! Please try again later.';
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
      }
    })

  }
}
