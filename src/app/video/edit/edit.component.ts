import { ClipService } from './../../services/clip.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import IClip from 'src/app/models/clip.model';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy{
  @Input() activeClip: IClip | null = null;
  @Output() updateEvent = new EventEmitter()
  showAlert = false;
  alertMsg = 'Please wait! Uploading clip.';
  alertColor = 'blue';
  inSubmission = false;
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  clipID = new FormControl('')
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })
  constructor(private modal: ModalService, private clipService: ClipService) { }
  ngOnDestroy(): void {
    this.modal.unRegister('editClip')
  }
  ngOnChanges(): void {
    if(!this.activeClip){
      return
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  ngOnInit() {
    this.modal.register('editClip')
  }
  async update(){
    if(!this.activeClip){
      return
    }
    this.showAlert = true;
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.alertMsg = 'Please wait! Uploading clip.';
    try{
      await this.clipService.updateClip(
        this.clipID.value, this.title.value
      )
    }
    catch(e){
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. try again later.';
      return
    }
    this.activeClip.title = this.title.value;
    this.updateEvent.emit(this.activeClip)
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success'

  }

}
