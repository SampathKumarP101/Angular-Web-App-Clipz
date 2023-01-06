import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-bloker]'
})
export class EventBlokerDirective {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event){
    event.preventDefault()
  }
}
