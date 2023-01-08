import { FfmpegService } from './../../services/ffmpeg.service';
import { Router } from '@angular/router';
import { ClipService } from './../../services/clip.service';
import  firebase  from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component,  OnDestroy } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { switchMap, combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  alertMsg = 'Please wait your clip is being uploaded..'
  showAlert = false;
  alertColor = 'blue'
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  selectedScreenshot = '';
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
screenshots: string[] = [];
screenshotTask? : AngularFireUploadTask;
  constructor(private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService) {
    auth.user.subscribe( user => this.user = user);
    this.ffmpegService.init();
  }

  ngOnDestroy() {
    this.task?.cancel()
  }
  async storeFile(event: Event){
    if(this.ffmpegService.isRunning){
      return
    }
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer ?
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null;
    if(!this.file || this.file.type !== 'video/mp4') {
      return
    }
    this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    this.selectedScreenshot = this.screenshots[0];
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.nextStep = true;

  }
  async uploadFile(){
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait your clip is being uploaded..';
    this.inSubmission = true;
    this.showPercentage = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )

    const screenshotPath = `screenshots/${clipFileName}.png`;


    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if(!clipProgress || !screenshotProgress) {
        return
      }
      const total = clipProgress + screenshotProgress;
      this.percentage = total as number / 200;
    })
    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {

        const [clipURL, screenshotURL] = urls
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipsService.createClip(clip)
        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip is now ready to share with world!.';
        this.showPercentage = true;
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)
      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.';
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
      }
    })

  }
}
