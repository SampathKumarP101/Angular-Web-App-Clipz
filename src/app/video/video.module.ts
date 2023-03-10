import { SafeURLPipe } from './pipes/safeURL.pipe';
import { EditComponent } from './edit/edit.component';
import { ManageComponent } from './manage/manage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { SharedModule } from './../shared/shared.module';
import { VideoRoutingModule } from './video-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VideoRoutingModule,
    SharedModule
  ],
  declarations: [
    ManageComponent,
    UploadComponent,
    EditComponent,
    SafeURLPipe
  ]

})
export class VideoModule { }
