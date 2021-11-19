import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-input-text-box',
  templateUrl: 'text-box.component.html',
  styleUrls: ['./text-box.component.scss'],
})

export class TextBoxComponent implements AfterViewInit {
  @Input() placeholder: string
  @Output() focusEvent = new EventEmitter()
  @Output() focusOutEvent = new EventEmitter()

  @Output() inputEvent = new EventEmitter<string>()

  @ViewChild('input') inputRef: ElementRef<HTMLInputElement>

  ngAfterViewInit() {
    fromEvent(this.inputRef.nativeElement, 'input')
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.inputEvent.emit(this.inputRef.nativeElement.value);
      });
  }
}