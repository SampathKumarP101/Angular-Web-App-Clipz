import { ClipService } from './../services/clip.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clipsList',
  templateUrl: './clipsList.component.html',
  styleUrls: ['./clipsList.component.css']
})
export class ClipsListComponent implements OnInit, OnDestroy {

  constructor(public clipService: ClipService) {
    clipService.getClips();
  }

  ngOnInit() {
    window.addEventListener('scroll', this.handleScroll)
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
    window.removeEventListener('scroll', this.handleScroll);
  }
}
