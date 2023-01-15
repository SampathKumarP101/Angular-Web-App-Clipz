import { DatePipe } from '@angular/common';
import { ClipService } from './../services/clip.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-clipsList',
  templateUrl: './clipsList.component.html',
  styleUrls: ['./clipsList.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true;
  constructor(public clipService: ClipService) {
    clipService.getClips();
  }

  ngOnInit() {
    if(this.scrollable){
      window.addEventListener('scroll', this.handleScroll)
    }
  }
  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if(bottomOfWindow) {
      this.clipService.getClips()
    }
  }
  ngOnDestroy() {
    if(this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);

    }
    this.clipService.pageClips = [];
  }
}
